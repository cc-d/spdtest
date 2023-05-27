# server.py
#!/usr/bin/env python3
from flask import Flask, send_file, request

app = Flask(__name__)

@app.route('/')
def home():
    """Render the web UI."""
    return send_file('index.html')

@app.route('/download', methods=['GET'])
def download():
    """Provide the 50MB file for download."""
    return send_file('50mb.data', as_attachment=True)

@app.route('/upload', methods=['POST'])
def upload():
    """Accept the 20MB file for upload."""
    file = request.files.get('file')
    if file:
        return {'message': 'File received'}, 200
    else:
        return {'message': 'No file received'}, 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
