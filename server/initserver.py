from flask import Flask, request
from PIL import Image
import json
app = Flask(__name__)

@app.route('/digest', methods=['POST'])
def initDigest():
    imageFile = request.files.get('imagefile', '')
    img = Image.open(imageFile)
    img.save("test.jpg", "JPEG")
    return "success"

@app.route('/health_check', methods=['GET'])
def health_check():
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 


