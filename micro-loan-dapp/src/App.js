import React, { useEffect, useState, useRef } from 'react';
import Web3 from 'web3';
import LoanContract from './contracts/LoanContract.json';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Slider,
  Box,
  Collapse,
  IconButton,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import logo from './logo.svg';
import Login from './Login';
import { ToastContainer, toast } from 'react-toastify';
import SlotCounter from 'react-slot-counter';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Define options for encoded variables
const homeOwnershipOptions = [
  { value: 0, label: 'RENT' },
  { value: 1, label: 'OWN' },
  { value: 2, label: 'MORTGAGE' }
];

const loanIntentOptions = [
  { value: 0, label: 'PERSONAL' },
  { value: 1, label: 'EDUCATION' },
  { value: 2, label: 'MEDICAL' },
  { value: 3, label: 'VENTURE' }
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [loanAmount, setLoanAmount] = useState('');
  const [loanInterest, setLoanInterest] = useState(10);
  const [loanDuration, setLoanDuration] = useState('');
  const [loanDescription, setLoanDescription] = useState('');
  const [personAge, setPersonAge] = useState('');
  const [personIncome, setPersonIncome] = useState('');
  const [personHomeOwnership, setPersonHomeOwnership] = useState('');
  const [personEmpLength, setPersonEmpLength] = useState('');
  const [loanIntent, setLoanIntent] = useState('');
  const [loans, setLoans] = useState([]);
  const [activeAccount, setActiveAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [expandedLoan, setExpandedLoan] = useState(null);
  const web3Ref = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        web3Ref.current = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545'));
        const networkId = await web3Ref.current.eth.net.getId();
        const deployedNetwork = LoanContract.networks[networkId];
        if (deployedNetwork) {
          const instance = new web3Ref.current.eth.Contract(
            LoanContract.abi,
            deployedNetwork.address
          );
          const accounts = await web3Ref.current.eth.getAccounts();
          setAccounts(accounts);
          setActiveAccount(accounts[0]);
          setContract(instance);
          fetchLoans(instance);
          fetchBalance(accounts[0]);
        } else {
          console.error('Contract not deployed to the detected network.');
        }
      } catch (error) {
        console.error('Error initializing web3 and contract:', error);
      }
    };

    if (isLoggedIn) {
      init();
    }
  }, [isLoggedIn]);

  const fetchBalance = async (account) => {
    if (!web3Ref.current) return;
    const balanceInWei = await web3Ref.current.eth.getBalance(account);
    const balanceInEth = web3Ref.current.utils.fromWei(balanceInWei, 'ether');
    setBalance(balanceInEth);
  };

  const fetchLoans = async (contractInstance) => {
    if (!contractInstance) return;

    const totalLoans = await contractInstance.methods.loanCounter().call();
    const loansArray = [];

    for (let i = 1; i <= totalLoans; i++) {
      const loan = await contractInstance.methods.loans(i).call();
      loansArray.push({
        id: i,
        amount: web3Ref.current.utils.fromWei(loan.amount, 'ether'),
        interest: web3Ref.current.utils.fromWei(loan.interest, 'ether'),
        duration: loan.duration.toString(),
        description: loan.description,
        borrower: loan.borrower,
        lender: loan.lender,
        repaid: loan.repaid === true,
        riskScore: loan.riskScore // Include riskScore
      });
    }

    setLoans(loansArray);
  };

  const requestLoan = async () => {
    if (contract && activeAccount && loanAmount && loanInterest && loanDuration && loanDescription && personAge && personIncome && personHomeOwnership !== '' && personEmpLength && loanIntent !== '') {
      try {
        const amount = web3Ref.current.utils.toWei(loanAmount, 'ether');
        const interest = web3Ref.current.utils.toWei(loanInterest.toString(), 'ether');
        const duration = parseInt(loanDuration, 10);

        console.log("Requesting risk score with data: ", {
          person_age: personAge,
          person_income: personIncome,
          person_home_ownership: personHomeOwnership,
          person_emp_length: personEmpLength,
          loan_intent: loanIntent,
          loan_amnt: loanAmount,
          loan_int_rate: loanInterest
        });

        const riskResponse = await axios.post('http://127.0.0.1:5000/risk_score', {
          person_age: personAge,
          person_income: personIncome,
          person_home_ownership: personHomeOwnership,
          person_emp_length: personEmpLength,
          loan_intent: loanIntent,
          loan_amnt: loanAmount,
          loan_int_rate: loanInterest
        });

        let riskScore = riskResponse.data.risk_score;
        riskScore = Math.round(riskScore * 100); // Scale riskScore to an integer

        console.log("Creating loan with: ", {
          amount, interest, duration, loanDescription, riskScore
        });

        await contract.methods.createLoan(amount, interest, duration, loanDescription, riskScore).send({
          from: activeAccount,
          gas: 200000,
          gasPrice: Web3.utils.toWei('20', 'gwei')
        });
        fetchLoans(contract);
        setLoanAmount('');
        setLoanInterest(10);
        setLoanDuration('');
        setLoanDescription('');
        setPersonAge('');
        setPersonIncome('');
        setPersonHomeOwnership('');
        setPersonEmpLength('');
        setLoanIntent('');
        fetchBalance(activeAccount);
        toast.success('Loan created successfully with a risk score of ' + riskScore / 100);
      } catch (error) {
        console.error('Error creating loan:', error);
        toast.error('Error creating loan.');
      }
    } else {
      toast.error('Please fill out all fields to request a loan.');
    }
  };

  const fundLoan = async (loanId, amount) => {
    if (contract && activeAccount) {
      const balanceInWei = await web3Ref.current.eth.getBalance(activeAccount);
      const amountInWei = web3Ref.current.utils.toWei(amount, 'ether');
      if (parseFloat(balanceInWei) < parseFloat(amountInWei)) {
        toast.error('Insufficient funds to fund the loan.');
        return;
      }
      try {
        await contract.methods.fundLoan(loanId).send({
          from: activeAccount,
          value: amountInWei,
          gas: 200000,
          gasPrice: Web3.utils.toWei('20', 'gwei')
        });
        fetchLoans(contract);
        fetchBalance(activeAccount);
        toast.success('Loan funded successfully!');
      } catch (error) {
        console.error('Error funding loan:', error);
        toast.error('Error funding loan.');
      }
    } else {
      console.error('Contract is not initialized or active account is not available');
    }
  };

  const repayLoan = async (loanId, amount, interest) => {
    if (contract && activeAccount) {
      const totalRepayment = web3Ref.current.utils.toWei((parseFloat(amount) + parseFloat(interest)).toString(), 'ether');
      const balanceInWei = await web3Ref.current.eth.getBalance(activeAccount);
      if (parseFloat(balanceInWei) < parseFloat(totalRepayment)) {
        toast.error('Insufficient funds to repay the loan.');
        return;
      }
      try {
        await contract.methods.repayLoan(loanId).send({
          from: activeAccount,
          value: totalRepayment,
          gas: 200000,
          gasPrice: Web3.utils.toWei('20', 'gwei')
        });
        fetchLoans(contract);
        fetchBalance(activeAccount);
        toast.success('Loan repaid successfully!');
      } catch (error) {
        console.error('Error repaying loan:', error);
        toast.error('Error repaying loan.');
      }
    } else {
      console.error('Contract is not initialized or active account is not available');
    }
  };

  const handleAccountChange = (account) => {
    setActiveAccount(account);
    fetchBalance(account);
  };

  const handleLoanAmountChange = (e) => {
    const value = e.target.value;
    if (parseFloat(value) > parseFloat(balance)) {
      toast.error('Loan amount cannot exceed current balance.');
      setLoanAmount(balance);
    } else {
      setLoanAmount(value);
    }
  };

  const handleExpandClick = (loanId) => {
    setExpandedLoan(expandedLoan === loanId ? null : loanId);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    toast.info('Logged out successfully.');
  };

  const renderRiskScore = (score) => {
    const normalizedScore = Number(score) / 100; // Convert BigInt to number and normalize
    const color = normalizedScore < 0.5 ? 'red' : 'green';

    return (
      <Box width="100%" display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <div style={{
            width: '100%',
            height: '10px',
            backgroundColor: 'lightgrey',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${normalizedScore * 100}%`,
              height: '100%',
              backgroundColor: color
            }}></div>
          </div>
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{normalizedScore.toFixed(2)}</Typography>
        </Box>
      </Box>
    );
  };

  const currentLoans = loans.filter(loan => loan.lender === '0x0000000000000000000000000000000000000000' && !loan.repaid);
  const outstandingLoans = loans.filter(loan => loan.lender !== '0x0000000000000000000000000000000000000000' && !loan.repaid);

  if (!isLoggedIn) {
    return <Login onLogin={(username) => { setUsername(username); setIsLoggedIn(true); }} />;
  }

  return (
    <Container>
      <ToastContainer />
      <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
        <img src={logo} alt="Logo" style={{ width: 250, height: 250 }} />
      </Box>
      <Typography variant="h6" align="center" gutterBottom>
        Welcome back {username}!
      </Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          style={{ borderRadius: '20px' }}
        >
          Logout
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="accounts">Select Account</InputLabel>
            <Select
              id="accounts"
              value={activeAccount}
              onChange={e => handleAccountChange(e.target.value)}
            >
              {accounts.map(account => (
                <MenuItem key={account} value={account}>{account}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              avatar={<AccountBalanceWalletIcon />}
              title="Current Balance"
            />
            <CardContent>
              <SlotCounter value={balance} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            value={loanAmount}
            onChange={handleLoanAmountChange}
            label="Loan Amount"
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Typography gutterBottom>Interest Rate (%)</Typography>
            <Slider
              value={loanInterest}
              onChange={(e, newValue) => setLoanInterest(newValue)}
              aria-labelledby="interest-rate-slider"
              valueLabelDisplay="auto"
              step={0.5}
              marks
              min={1}
              max={20}
              style={{ marginLeft: 16, marginRight: 16 }}
            />
            <Typography>{loanInterest}%</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            value={loanDuration}
            onChange={e => setLoanDuration(e.target.value)}
            label="Duration (days)"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            value={loanDescription}
            onChange={e => setLoanDescription(e.target.value)}
            label="Loan Description"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            value={personAge}
            onChange={e => setPersonAge(e.target.value)}
            label="Person Age"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            value={personIncome}
            onChange={e => setPersonIncome(e.target.value)}
            label="Person Income"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Person Home Ownership</InputLabel>
            <Select
              value={personHomeOwnership}
              onChange={e => setPersonHomeOwnership(e.target.value)}
            >
              {homeOwnershipOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            value={personEmpLength}
            onChange={e => setPersonEmpLength(e.target.value)}
            label="Employment Length"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Loan Intent</InputLabel>
            <Select
              value={loanIntent}
              onChange={e => setLoanIntent(e.target.value)}
            >
              {loanIntentOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={requestLoan}
          >
            Request Loan
          </Button>
        </Grid>
      </Grid>
      <Box mt={8}>
        <Typography variant="h4" gutterBottom>Current Available Loans</Typography>
        {currentLoans.length === 0 ? (
          <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
            <CheckCircleOutlineIcon style={{ marginRight: '8px' }} />
            <Typography variant="body1">No available loans, come back later.</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
            <Table style={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Amount (ETH)</TableCell>
                  <TableCell>Interest (%)</TableCell>
                  <TableCell>Duration (days)</TableCell>
                  <TableCell>Borrower</TableCell>
                  <TableCell>Lender</TableCell>
                  <TableCell>Repaid</TableCell>
                  <TableCell>Risk Score</TableCell> {/* New column for risk score */}
                  <TableCell>Actions</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentLoans.map(loan => (
                  <React.Fragment key={loan.id}>
                    <TableRow>
                      <TableCell>{loan.id}</TableCell>
                      <TableCell>{loan.amount}</TableCell>
                      <TableCell>{loan.interest}</TableCell>
                      <TableCell>{loan.duration}</TableCell>
                      <TableCell>{loan.borrower}</TableCell>
                      <TableCell>{loan.lender}</TableCell>
                      <TableCell>{loan.repaid ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{renderRiskScore(loan.riskScore)}</TableCell> {/* Render risk score */}
                      <TableCell>
                        {activeAccount !== loan.borrower && (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => fundLoan(loan.id, loan.amount)}
                          >
                            Fund Loan
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleExpandClick(loan.id)}>
                          {expandedLoan === loan.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                        <Collapse in={expandedLoan === loan.id} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <Typography variant="body1">{loan.description}</Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>Outstanding Loans</Typography>
        {outstandingLoans.length === 0 ? (
          <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
            <CheckCircleOutlineIcon style={{ marginRight: '8px' }} />
            <Typography variant="body1">Sit back, all loans paid back.</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
            <Table style={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Amount (ETH)</TableCell>
                  <TableCell>Interest (%)</TableCell>
                  <TableCell>Duration (days)</TableCell>
                  <TableCell>Borrower</TableCell>
                  <TableCell>Lender</TableCell>
                  <TableCell>Repaid</TableCell>
                  <TableCell>Risk Score</TableCell> {/* New column for risk score */}
                  <TableCell>Actions</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {outstandingLoans.map(loan => (
                  <React.Fragment key={loan.id}>
                    <TableRow>
                      <TableCell>{loan.id}</TableCell>
                      <TableCell>{loan.amount}</TableCell>
                      <TableCell>{loan.interest}</TableCell>
                      <TableCell>{loan.duration}</TableCell>
                      <TableCell>{loan.borrower}</TableCell>
                      <TableCell>{loan.lender}</TableCell>
                      <TableCell>{loan.repaid ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{renderRiskScore(loan.riskScore)}</TableCell> {/* Render risk score */}
                      <TableCell>
                        {activeAccount === loan.borrower && (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => repayLoan(loan.id, loan.amount, loan.interest)}
                          >
                            Repay Loan
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleExpandClick(loan.id)}>
                          {expandedLoan === loan.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                        <Collapse in={expandedLoan === loan.id} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <Typography variant="body1">{loan.description}</Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}

export default App;
