# server.py
#!/usr/bin/env python3
from flask import Flask, send_from_directory, request
import os

app = Flask(__name__)

@app.route('/download', methods=['GET'])
def download():
    """Provide the 50MB file for download."""
    return send_from_directory(os.getcwd(), '50mb.data')

@app.route('/upload', methods=['POST'])
def upload():
    """Accept the 20MB file for upload."""
    file = request.files.get('file')
    if file:
        return {'message': 'File received'}, 200
    else:
        return {'message': 'No file received'}, 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
