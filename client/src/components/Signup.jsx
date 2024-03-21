import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, makeStyles, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  form: {
    width: '400px',
    padding: theme.spacing(3),
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: theme.spacing(2),
  },
}));

const Signup = () => {
  const classes = useStyles();
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: signupUsername,
          password: signupPassword,
          email: signupEmail,
          phone: signupPhone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup successful', data);
        navigate(data.redirect);
      } else {
        console.error('Signup failed', data);
      }
    } catch (error) {
      console.error('Error during signup', error);
    }
  };

  return (
    <Container className={classes.container}>
      <Box className={classes.form}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <form>
          <TextField
            className={classes.input}
            label="Username"
            variant="outlined"
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
          />
          <TextField
            className={classes.input}
            label="Password"
            variant="outlined"
            type="password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />
          <TextField
            className={classes.input}
            label="Email"
            variant="outlined"
            type="email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
          />
          <TextField
            className={classes.input}
            label="Phone"
            variant="outlined"
            value={signupPhone}
            onChange={(e) => setSignupPhone(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSignup}>
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Signup;
