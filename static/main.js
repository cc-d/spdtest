    // Define global variables
    let peakAverage = 0;
    let totalBytes = 0;
    let totalChunks = 0;
    let totalElapsedTime = 0;

    async function downloadAndUploadFile() {
      // Reset global variables
      peakAverage = 0;
      totalBytes = 0;
      totalChunks = 0;
      totalElapsedTime = 0;

      // Get selected file size
      let size = document.getElementById('fileSize').value;

      const start = Date.now();
      const response = await fetch('/download?size=' + size, { method: 'GET' });
      const uploadResponse = response.clone();  // Clone the response for later upload
      const reader = response.body.getReader();
      const contentLength = + response.headers.get('Content-Length');

      // Process data as it arrives
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        totalChunks++;
        totalBytes += value.length;

        const elapsed = (Date.now() - start) / 1000;
        const timeDiff = (elapsed - totalElapsedTime)

        totalElapsedTime += timeDiff;
        const averageSpeed = totalBytes / totalElapsedTime;

        if (averageSpeed > peakAverage) {
          peakAverage = averageSpeed;
        }

        // Update the UI
        updateUI(totalBytes, contentLength, peakAverage, averageSpeed);
      }

      // After the file is downloaded, upload the file
      await uploadFile(new Blob([await uploadResponse.arrayBuffer()]));
    }

    function uploadFile(file) {
      return new Promise((resolve, reject) => {
        var formData = new FormData();
        formData.append('file', file);

        var xhr = new XMLHttpRequest();

        let uploadStartTime = Date.now();
        let lastTime = uploadStartTime;
        let lastLoaded = 0;
        let peakUploadSpeed = 0;

        // Update progress bar as file is uploaded
        xhr.upload.onprogress = function (e) {
          let currentTime = Date.now();
          let elapsedTime = (currentTime - uploadStartTime) / 1000;
          let elapsedSinceLastTime = (currentTime - lastTime) / 1000;

          let loadedSinceLastTime = e.loaded - lastLoaded;
          let uploadSpeed = loadedSinceLastTime / elapsedSinceLastTime;
          if (uploadSpeed > peakUploadSpeed) {
            peakUploadSpeed = uploadSpeed;
          }

          document.getElementById('uploadSpeed').textContent = 'Average upload speed: ' + formatSpeed(uploadSpeed);
          document.getElementById('peakUploadSpeed').textContent = 'Peak upload speed: ' + formatSpeed(peakUploadSpeed);

          lastTime = currentTime;
          lastLoaded = e.loaded;

          var percentComplete = (e.loaded / e.total) * 100;
          document.getElementById('uploadProgress').style.width = percentComplete + '%';
          document.getElementById('uploadProgressText').textContent = percentComplete.toFixed(2) + '%';
        };

        xhr.open('POST', '/upload', true);

        xhr.onload = function () {
          if (xhr.status === 200) {
            var result = JSON.parse(xhr.response);
            document.getElementById('uploadRemainingProgress').textContent = result.message;
            resolve();
          } else {
            reject('Error ' + xhr.status);
          }
        };

        xhr.send(formData);
      });
    }



    function formatSpeed(speedInBps) {
      let speed = speedInBps;
      let unit = 'Bps';

      if (speed > 1000) {
        speed = speed / 1024;
        unit = 'KBps';
      }
      if (speed > 1000) {
        speed = speed / 1024;
        unit = 'MBps';
      }

      return speed.toFixed(2) + ' ' + unit;
    }

    function updateUI(totalBytes, totalBytesExpected, peakAverage, averageSpeed) {
      document.getElementById('averageSpeed').textContent = 'Average download speed: ' + formatSpeed(averageSpeed);
      document.getElementById('peakAverage').textContent = 'Peak download speed: ' + formatSpeed(peakAverage);
      const totalProgressPercentage = (totalBytes / totalBytesExpected) * 100;
      document.getElementById('totalProgress').textContent = 'Total progress: ' + totalProgressPercentage.toFixed(2) + '%';
      document.getElementById('downloadProgress').style.width = totalProgressPercentage + '%';
      document.getElementById('downloadProgressText').textContent = totalProgressPercentage.toFixed(2) + '%';
      document.getElementById('uploadRemainingProgress').textContent = 'Remaining progress: ' + ((1 - totalBytes / totalBytesExpected) * 100).toFixed(2) + '%';
    }