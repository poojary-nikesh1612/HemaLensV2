from flask import Flask,jsonify, request
from werkzeug.utils import secure_filename
from flask_cors import CORS
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import tensorflow as tf
import numpy as np
import os
import math

app=Flask(__name__)
CORS(app)

try:
    model = tf.keras.models.load_model('anemia_classifier.keras')
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

def preprocess_image(temp_path):
    img = load_img(temp_path, target_size=(224, 224))
    img = img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = tf.keras.applications.mobilenet_v2.preprocess_input(img)
    return img

@app.route('/predict', methods=['POST'])
def predict():
  
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    if 'image' not in request.files:
       
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']

    filename = secure_filename(file.filename)

    if not os.path.exists('/tmp'):
        os.makedirs('/tmp')
    temp_path = os.path.join('/tmp', filename) 
    file.save(temp_path)
   
    try:
        
        processed_image = preprocess_image(temp_path)
        
        prediction = model.predict(processed_image)
        print(prediction)
        
        anemic_prob = prediction[0][0]

        if anemic_prob > 0.75:
            isAnemic=1
            confidence_level = float(anemic_prob * 100)
        else:
            isAnemic=0
            confidence_level = float((1 - anemic_prob) * 100)

        print(f'isAnemic:{isAnemic} and conf:{confidence_level}')

        truncated_confidence = math.trunc(confidence_level * 100) / 100
        
        return jsonify({"isAnemic": isAnemic,
            "confidence_level": f"{truncated_confidence:.2f}"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ =="__main__":
    app.run(debug=True, port=5000)