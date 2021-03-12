
import os
import base64
from flask import Flask
from flask import request
from flask import jsonify
from flask import render_template
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
@app.route('/stt')
def hello_stt():
    return render_template('stt.html')


@app.route('/trans', methods=['POST'])
def stt():
	# transcription =  # 
    return(jsonify({"response": "ok", "transcript": transcription}))


@app.route('/tts')
def hello_tts():
    return render_template('tts.html')


@app.route('/synt', methods=['POST'])
def tts():
	# data =  
    return(jsonify({"response": "ok", "output_audio_base64": data}))



app.config["DEBUG"]=True
if __name__ == '__main__':
    app.run(port=8080)
