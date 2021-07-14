import pandas as pd
import numpy as np
from flask import Flask, render_template,request
import pickle
import yfinance as yf

# Create an instance of Flask
app = Flask(__name__)

model = pickle.load(open('Final_Project\model.pkl', 'rb'))

# Route to render index.html template using data from Mongo
@app.route('/')
def home():
    return render_template('index.html')

# Route that will trigger the scrape function
@app.route('/predict',methods=['POST'])
def predict():
    #For rendering results on HTML GUI
    ticker = request.form['ticker']
    processed_ticker= ticker.upper()


    # Fetching data from Yahoo Finance
    data = yf.download(processed_ticker)
    forecast_out = int(request.form['forecast_out'])
    data['Predictions'] = data['Adj Close'].shift(-forecast_out)
    data = data[['Adj Close', 'Predictions']]
    X = data.drop(['Predictions'], axis=1)
    X = X[:-forecast_out]
    y = data['Predictions']
    y = y[:-forecast_out]
    prediction = model.predict(X)
    prediction = 'The price of {} will move from ${} to ${} in {} days.'.format(processed_ticker, y[-1].round(2), prediction[-1].round(2), forecast_out)       
    return render_template('index.html', prediction=prediction)

if __name__ == "__main__":
    app.run(debug=True)