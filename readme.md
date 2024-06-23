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

## Setup Instructions

### Prerequisites

- Node.js and npm 
- Python and pip
- Ganache CLI (for local Ethereum blockchain)

### Installation Steps


1. **Install Node (if not installed)**:

    ```bash
    brew install node
     ```

2. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/micro-loan-dapp.git
    cd micro-loan-dapp
    ```

3. **Install backend dependencies**:

    ```bash
    cd flash-backend
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt
    ```

4. **Install frontend dependencies**:

    ```bash
    cd ../micro-loan-dapp
    npm install
    ```

5. **Install Ganache CLI**:

    ```bash
    npm install -g ganache-cli
    ```

6. **Start Ganache CLI**:

    ```bash
    ganache-cli
    ```

7. **Deploy Smart Contract**:

    ```bash
    truffle migrate
    ```
### Running the Application

1. **Start the backend server**:

    ```bash
    cd flash-backend
    source venv/bin/activate
    flask run
    ```

2. **Start the frontend development server**:

    ```bash
    cd ../micro-loan-dapp
    npm start
    ```

3. **Interact with the application**:
    - Open your web browser and navigate to `http://localhost:3000`.

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

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**Third-Party Packages Used:**

1. **Flask**
   - License: BSD-3-Clause
   - URL: https://palletsprojects.com/p/flask/

2. **Flask-CORS**
   - License: MIT
   - URL: https://github.com/corydolphin/flask-cors

3. **scikit-learn**
   - License: BSD-3-Clause
   - URL: https://scikit-learn.org/stable/about.html#license

4. **React**
   - License: MIT
   - URL: https://reactjs.org/

5. **axios**
   - License: MIT
   - URL: https://github.com/axios/axios

6. **Web3.js**
   - License: MIT
   - URL: https://github.com/ChainSafe/web3.js

**Dataset Used:**

- **Credit Risk Dataset**
  - Source: Kaggle
  - URL: https://www.kaggle.com/datasets/laotse/credit-risk-dataset
