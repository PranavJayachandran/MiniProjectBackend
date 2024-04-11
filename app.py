from flask import Flask,render_template,request,jsonify,redirect
import os
import requests
import pandas as pd
import pickle

app = Flask(__name__)

app.config['SECRET_KEY'] = 'random'


@app.route("/predict",methods=["POST"])
def predictwaterrequirement():
    input_json = request.get_json(force=True)
    print(input_json)
    soiltype=input_json['soiltype']
    croptype=input_json['croptype']
    temperature=input_json['temperature']
    region=input_json['region']
    weather_condition=input_json['weather_condition']
    with open('model.pkl', 'rb') as file:
        model = pickle.load(file)

    new_data = pd.DataFrame({
    'CROP TYPE': [1],
    'SOIL TYPE': [2],
    'REGION': [1],
    'TEMPERATURE GROUP': [13],
    'WEATHER CONDITION': [400]
    })
    prediction = model.predict(new_data)
    return str((round(prediction[0], 2)))

# main driver function
if __name__ == '__main__':
    app.run()