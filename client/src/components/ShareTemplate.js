import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { shareFormTemplate } from '../services/allAPI';

const ShareTemplate = ({ templateId, onClose }) => {
  const [emails, setEmails] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      const emailList = emails
        .split(',')
        .map((email) => email.trim());
      await shareFormTemplate(templateId, emailList);
      setSnackbar({
        open: true,
        message: 'Form shared successfully',
        severity: 'success',
      });
      if (onClose) onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to share form',
        severity: 'error',
      });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Share Template
      </Typography>
      <form onSubmit={handleShare}>
        <TextField
          fullWidth
          label="Email Addresses"
          helperText="Enter comma-separated email addresses"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Share
        </Button>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShareTemplate;
