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
import { register } from '../services/allAPI';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await register({ name, email, password });
      if (response?.data?.success) {
        navigate('/login');
      } else {
        setError(response?.data?.message || 'Registration failed.');
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
        Register
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleRegister}>
        <TextField
          label="Name"
          type="text"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
      </form>
    </Box>
  );
};

export default Register;
