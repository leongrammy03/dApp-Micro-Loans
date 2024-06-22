import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Link
} from '@mui/material';
import { useSpring, animated } from '@react-spring/web';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = () => {
    // Retrieve stored credentials from localStorage
    const storedCredentials = JSON.parse(localStorage.getItem('userCredentials'));
    if (storedCredentials && storedCredentials.username === username && storedCredentials.password === password) {
      setLoginSuccess(true);
      toast.success('Login successful!');
      setTimeout(() => {
        onLogin(username);
      }, 1000);
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleRegister = () => {
    // Save credentials to localStorage
    const userCredentials = {
      username,
      password
    };
    localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
    toast.success('Registration successful!');
    setIsRegistering(false); // Switch back to login view after successful registration
  };

  const fadeOutSpring = useSpring({
    opacity: loginSuccess ? 0 : 1,
    transform: loginSuccess ? 'translateY(-50px)' : 'translateY(0)',
    config: { duration: 1000 }
  });

  return (
    <animated.div style={fadeOutSpring}>
      <ToastContainer />
      <Container>
        <Box display="flex" alignItems="center" justifyContent="center" mb={4} mt={4}>
          <Avatar
            alt="User Picture"
            src="https://www.sketch.ca/sketchPub/uploads/2021/01/woman-of-Igbo-sun-portrait-details.jpg"
            sx={{ width: 150, height: 150 }}
          />
        </Box>
        <Typography variant="h4" align="center" gutterBottom>
          {isRegistering ? 'Register' : 'Login'}
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isRegistering ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegister}
              style={{ marginTop: 16 }}
            >
              Register
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              style={{ marginTop: 16 }}
            >
              Login
            </Button>
          )}
          <Box mt={2}>
            <Link
              component="button"
              variant="body2"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
            </Link>
          </Box>
        </Box>
      </Container>
    </animated.div>
  );
}

export default Login;
