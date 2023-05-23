# speedtest_client.py
#!/usr/bin/env python3
import requests
import time
import os

def speedtest(server_url: str) -> None:
    """Perform a speedtest by uploading a 20MB file and downloading a 50MB file from the server."""

    # Measure download speed of 50MB file
    start_time = time.time()
    response = requests.get(f"{server_url}/download")
    end_time = time.time()

    download_speed = len(response.content) / (end_time - start_time)
    print(f"Download speed: {download_speed / 1024 / 1024} MBps")

    # Measure upload speed of 20MB file
    with open("20mb.data", "rb") as f:
        start_time = time.time()
        response = requests.post(f"{server_url}/upload", files={'file': f})
        end_time = time.time()

    upload_speed = os.path.getsize("20mb.data") / (end_time - start_time)
    print(f"Upload speed: {upload_speed / 1024 / 1024} MBps")

if __name__ == "__main__":
    speedtest("http://localhost:5000")
