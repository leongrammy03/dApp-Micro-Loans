// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoanContract {
    struct Loan {
        uint amount;
        uint interest;
        uint duration;
        string description;
        address payable borrower;
        address payable lender;
        bool repaid;
        uint riskScore; // New field for risk score
    }

    mapping(uint => Loan) public loans;
    uint public loanCounter;

    event LoanCreated(uint loanId, uint amount, uint interest, uint duration, string description, uint riskScore, address borrower);
    event LoanFunded(uint loanId, address lender, uint amount);
    event LoanRepaid(uint loanId, uint amount, uint interest);

    function createLoan(uint _amount, uint _interest, uint _duration, string memory _description, uint _riskScore) public {
        loanCounter++;
        loans[loanCounter] = Loan(_amount, _interest, _duration, _description, payable(msg.sender), payable(address(0)), false, _riskScore);
        
        // Emit an event when a loan is created
        emit LoanCreated(loanCounter, _amount, _interest, _duration, _description, _riskScore, msg.sender);
    }

    function fundLoan(uint _loanId) public payable {
        Loan storage loan = loans[_loanId];
        require(msg.value == loan.amount, "Incorrect amount");
        require(loan.lender == address(0), "Loan already funded");

        loan.lender = payable(msg.sender);
        loan.borrower.transfer(msg.value);

        // Emit an event when a loan is funded
        emit LoanFunded(_loanId, msg.sender, msg.value);
    }

    function repayLoan(uint _loanId) public payable {
        Loan storage loan = loans[_loanId];
        require(msg.sender == loan.borrower, "Only borrower can repay");
        require(msg.value == loan.amount + loan.interest, "Incorrect amount");
        require(!loan.repaid, "Loan already repaid");

        loan.lender.transfer(msg.value);
        loan.repaid = true;

        // Emit an event when a loan is repaid
        emit LoanRepaid(_loanId, loan.amount, loan.interest);
    }
}
