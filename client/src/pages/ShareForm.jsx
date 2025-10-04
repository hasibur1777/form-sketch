import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  shareFormTemplate,
  fetchTemplateById,
} from '../services/allAPI';

const ShareFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emails, setEmails] = useState('');
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchTemplateById(id)
      .then((res) => {
        setTemplate(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message:
            error.response?.data?.error || 'Failed to load template',
          severity: 'error',
        });
        setLoading(false);
      });
  }, [id]);

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      const emailList = emails
        .split(',')
        .map((email) => email.trim());
      await shareFormTemplate(id, emailList);
      setSnackbar({
        open: true,
        message: 'Form shared successfully',
        severity: 'success',
      });
      setEmails('');
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.error || 'Failed to share form',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!template) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Alert severity="error">
          Template not found or access denied
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/home')}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Share Form
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {template.name}
        </Typography>

        <Box component="form" onSubmit={handleShare}>
          <TextField
            fullWidth
            label="Email Addresses"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            helperText="Enter multiple email addresses separated by commas"
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Share Form
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/template/${id}/responses`)}
            sx={{ mr: 2 }}
          >
            View Responses
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/home')}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShareFormPage;
