import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/allAPI';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill out all fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await login({ email, password });

      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      } else {
        setError(response?.data?.message || 'Invalid credentials.');
      }
    } catch (err) {
      setError(
        `An error occurred: ${
          err.response?.data?.message || 'Please try again.'
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: 'auto',
        backgroundColor: 'white',
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
        mt: 5,
      }}
    >
      <Typography variant="h5" mb={2}>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
      </form>
    </Box>
  );
};

export default Login;
