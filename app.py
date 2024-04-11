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
    clf = pickle.load( open('model.pkl', 'rb') )
    clf.__getstate__()['_sklearn_version']

    new_data = pd.DataFrame({
    'CROP TYPE': [croptype],
    'SOIL TYPE': [soiltype],
    'REGION': [region],
    'TEMPERATURE GROUP': [temperature],
    'WEATHER CONDITION': [weather_condition]
    })
    prediction = model.predict(new_data)
    print(prediction)
    return str((round(prediction[0], 2)))

# main driver function
if __name__ == '__main__':
    app.run()