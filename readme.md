# dApp Micro Loans

## Overview

This project is a decentralized application (dApp) for micro loans. It allows users to request and fund loans using a blockchain-based smart contract. The risk score of each loan is calculated using a machine learning model trained on a public dataset.

## Features

- Users can request loans by providing details such as loan amount, interest rate, duration, and personal information.
- Loans can be funded by other users.
- Risk scores are calculated for each loan request to help lenders make informed decisions.
- Risk scores are displayed as a visual bar in the UI.

## Technologies Used

- **Frontend**: React, Material-UI
- **Backend**: Flask, Flask-CORS
- **Blockchain**: Web3.js, Solidity, Ganache
- **Machine Learning**: Scikit-learn
- **Public Dataset**: [Kaggle Credit Risk Dataset](https://www.kaggle.com/datasets/laotse/credit-risk-dataset)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/dapp-micro-loans.git
    cd dapp-micro-loans
    ```

2. Install the required dependencies:

    ```sh
    npm install
    cd flash-backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

3. Start the Ganache blockchain:

    ```sh
    ganache-cli
    ```

4. Deploy the smart contract:

    ```sh
    truffle migrate
    ```

5. Start the Flask server:

    ```sh
    cd flash-backend
    source venv/bin/activate
    python app.py
    ```

6. Start the React frontend:

    ```sh
    npm start
    ```

## Dataset

The machine learning model was trained using a public dataset from Kaggle. You can find the dataset [here](https://www.kaggle.com/datasets/laotse/credit-risk-dataset).

## Machine Learning Model

The `RandomForestClassifier` from the Scikit-learn library was used to train the risk assessment model. The model predicts the probability of loan default based on several input features.

### Training the Model

1. Download the dataset from Kaggle and place it in the `flash-backend` directory.
2. Run the training script to train the model:

    ```sh
    cd flash-backend
    source venv/bin/activate
    python train_model.py
    ```

This script will:
- Load and preprocess the dataset.
- Encode categorical variables.
- Train a `RandomForestClassifier`.
- Save the trained model and encoders as `.pkl` files.

## Usage

### Request a Loan

1. Log in to the application.
2. Fill in the loan request form with the required details.
3. Submit the request to create a loan.

### Fund a Loan

1. Browse the list of available loans.
2. Select a loan to fund and click the "Fund Loan" button.

### Repay a Loan

1. Browse the list of your outstanding loans.
2. Select a loan to repay and click the "Repay Loan" button.

## Contributing

Contributions are welcome! Please create a pull request or open an issue to discuss your changes.

## License

This project is licensed under the MIT License.
