import React from 'react';
import { Box, Typography } from '@mui/material';

const Profile = () => {
  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: 'auto',
        mt: 5,
        textAlign: 'center',
        backgroundColor: 'white',
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" mb={2}>
        Profile
      </Typography>
      <Typography variant="body1">
        Welcome to your profile page!
      </Typography>
    </Box>
  );
};

export default Profile;
