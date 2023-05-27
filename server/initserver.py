from flask import Flask, request
import base64
import json
app = Flask(__name__)

urls = {}

@app.route('/digest', methods=['POST'])
def initDigest():
    file = request.form['imagefile'].split('base64,')[1]
    base_64_to_image(file)
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@app.route('/health_check', methods=['GET'])
def health_check():
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@app.route('/url', methods=['GET', 'POST'])
def urlReader():
    print(request.json['url'])
    if request.method == 'GET':
        if request.json['url'] in urls:
            return json.dumps({'found':True}), 200, {'ContentType':'application/json'}
        else:
            return json.dumps({'found':False}), 200, {'ContentType':'application/json'}
    elif request.method == 'POST':
        urls[request.json['url']] = request.json['ecommerce']
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 


def base_64_to_image(base64_string):
    imgdata = base64.b64decode(base64_string)
    filename = 'test.jpg'
    with open(filename, 'wb') as f:
        f.write(imgdata)

