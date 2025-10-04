import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import { getUserProfile } from '../services/allAPI';
import PersonIcon from '@mui/icons-material/Person';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setUserProfile(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error || 'Failed to load profile'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          maxWidth: 600,
          margin: 'auto',
          mt: 5,
          textAlign: 'center',
          color: 'error.main',
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: 'auto',
        mt: 5,
        textAlign: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            margin: '0 auto 16px',
            backgroundColor: 'primary.main',
          }}
        >
          <PersonIcon sx={{ fontSize: 40 }} />
        </Avatar>

        <Typography variant="h4" mb={2}>
          {userProfile?.name}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: 'left', mt: 3 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            gutterBottom
          >
            Email
          </Typography>
          <Typography variant="body1" mb={2}>
            {userProfile?.email}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            gutterBottom
          >
            Role
          </Typography>
          <Typography variant="body1">
            {userProfile?.role || 'User'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
