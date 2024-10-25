import os
from flask import Flask, render_template, request, jsonify
from tensorflow import keras
import cv2
import numpy as np
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'  # Temporary image upload folder

# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Load the Keras model
model = keras.models.load_model("Skin_Cancer_Detector.h5")

def predict_cancer(image_path):
    # Load and preprocess the image
    test_image = cv2.imread(image_path)
    if test_image is None:
        return "Error: Could not read image file."
    
    test_image = cv2.resize(test_image, (256, 256))
    test_input = test_image.reshape((1, 256, 256, 3))
    prediction = model.predict(test_input)
    
    # Determine result and suggestion based on prediction
    if round(prediction[0][0], 0) == 0:
        result = "Benign"
        suggestion = "The lesion is benign and not cancerous. Regular monitoring is recommended."
    else:
        result = "Malignant"
        suggestion = "The lesion appears malignant. Please consult a dermatologist immediately for further evaluation."
    
    return result, suggestion

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    # Save the uploaded image
    image_file = request.files['image']
    filename = secure_filename(image_file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image_file.save(file_path)
    
    # Get prediction and suggestion
    result, suggestion = predict_cancer(file_path)
    
    # Remove the uploaded image after processing
    os.remove(file_path)
    
    return jsonify({"result": result, "suggestion": suggestion})

if __name__ == '__main__':
    app.run(debug=True)
