from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load the pre-trained model and label encoders
model = joblib.load('loan_risk_model.pkl')

@app.route('/risk_score', methods=['POST'])
def risk_score():
    data = request.get_json()
    person_age = data['person_age']
    person_income = data['person_income']
    person_home_ownership = data['person_home_ownership']
    person_emp_length = data['person_emp_length']
    loan_intent = data['loan_intent']
    loan_amnt = data['loan_amnt']
    loan_int_rate = data['loan_int_rate']

    # Prepare the feature vector for prediction
    feature_vector = pd.DataFrame({
        'person_age': [person_age],
        'person_income': [person_income],
        'person_home_ownership': [person_home_ownership],
        'person_emp_length': [person_emp_length],
        'loan_intent': [loan_intent],
        'loan_amnt': [loan_amnt],
        'loan_int_rate': [loan_int_rate]
    })

    # Predict risk score
    risk_score = model.predict_proba(feature_vector)[:, 1][0]  # Probability of default

    return jsonify({'risk_score': risk_score})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
