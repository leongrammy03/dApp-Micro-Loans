# dApp Micro Loans

This repository contains a decentralized application (dApp) for managing microloans on the Ethereum blockchain. The application allows users to request, fund, and repay loans, with each loan associated with a risk score determined by a machine learning model.

## Project Structure

- `app.py`: Flask application that serves the machine learning model for risk score prediction.
- `train_model.py`: Script to train and save the machine learning model.
- `LoanContract.sol`: Solidity smart contract for managing loans on the Ethereum blockchain.
- `src/App.js`: React front-end application for interacting with the smart contract and Flask backend.
- `README.md`: This documentation file.

## Setup and Installation

### Prerequisites

- Python 3.x
- Node.js and npm
- Ganache (for local Ethereum blockchain)
- MetaMask (for interacting with the dApp)
- Flask
- Joblib
- Pandas
- NumPy
- Scikit-learn
- Web3.js

### Backend Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-repo/dapp-micro-loans.git
    cd dapp-micro-loans
    ```

2. **Set up a Python virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install Python dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Train the machine learning model:**

    ```bash
    python train_model.py
    ```

5. **Run the Flask application:**

    ```bash
    python app.py
    ```

### Smart Contract Deployment

1. **Start Ganache:**

    Open Ganache and create a new workspace.

2. **Compile and deploy the smart contract:**

    ```bash
    cd truffle
    truffle compile
    truffle migrate --network development
    ```

3. **Copy the deployed contract's address and update `src/contracts/LoanContract.json` with the new address.**

### Frontend Setup

1. **Navigate to the `src` directory:**

    ```bash
    cd src
    ```

2. **Install Node.js dependencies:**

    ```bash
    npm install
    ```

3. **Start the React application:**

    ```bash
    npm start
    ```

4. **Open your browser and navigate to `http://localhost:3000`.**

## Usage

### Request a Loan

1. **Log in to the application using your MetaMask account.**
2. **Fill out the loan request form with the necessary details.**
3. **Click on "Request Loan" to submit your loan request.**
4. **The loan will be processed and a risk score will be calculated and displayed.**

### Fund a Loan

1. **Log in to the application using your MetaMask account.**
2. **Navigate to the "Current Available Loans" section.**
3. **Click on "Fund Loan" next to the loan you wish to fund.**

### Repay a Loan

1. **Log in to the application using your MetaMask account.**
2. **Navigate to the "Outstanding Loans" section.**
3. **Click on "Repay Loan" next to the loan you wish to repay.**

## Changes Made

### Backend (Flask)

- Added a new Flask route to handle risk score predictions.
- Updated the `app.py` to load and use the pre-trained model for predicting risk scores.
- Added proper data handling and conversion for incoming requests.

### Frontend (React)

- Updated `App.js` to include the risk score in the loan request process.
- Modified the loan display tables to include a new column for displaying risk scores.
- Implemented a visual representation of the risk score using a color-coded bar.
- Ensured proper type conversions for data types, particularly handling BigInt values.

### Smart Contract

- Modified the `LoanContract.sol` to include a `riskScore` field in the `Loan` struct.
- Updated the `createLoan` function to accept and store the risk score.
- Deployed the updated contract and updated the front-end contract address reference.

## Contributing

If you wish to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
