import React, { useState, useEffect } from 'react';
import {
  fetchAllTemplates,
  fetchSharedWithMe,
} from '../services/allAPI';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Divider,
} from '@mui/material';

const Home = () => {
  const [templates, setTemplates] = useState({
    owned: [],
    shared: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesRes, sharedRes] = await Promise.all([
          fetchAllTemplates(),
          fetchSharedWithMe(),
        ]);

        setTemplates({
          owned: templatesRes.data.owned || [],
          shared: sharedRes.data || [],
        });
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Your Templates</Typography>
        <Button
          component={Link}
          to="/create-template"
          variant="contained"
          color="primary"
        >
          Create New Template
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Your Forms
        </Typography>
        <List>
          {templates.owned.map((template) => (
            <ListItem
              key={template.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography>{template.name}</Typography>
              <Box>
                <Button
                  component={Link}
                  to={`/fillup-template/${template.id}`}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Fill Form
                </Button>
                <Button
                  component={Link}
                  to={`/template/${template.id}/responses/`}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  View Responses
                </Button>
                <Button
                  component={Link}
                  to={`/template/${template.id}/share`}
                  size="small"
                  variant="outlined"
                  color="secondary"
                >
                  Share
                </Button>
              </Box>
            </ListItem>
          ))}
          {templates.owned.length === 0 && (
            <ListItem>
              <Typography color="text.secondary">
                You haven't created any forms yet
              </Typography>
            </ListItem>
          )}
        </List>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Shared with You
        </Typography>
        <List>
          {templates.shared.map((template) => (
            <ListItem
              key={template.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography>{template.name}</Typography>
              <Button
                component={Link}
                to={`/fillup-template/${template.id}`}
                size="small"
              >
                Fill Form
              </Button>
            </ListItem>
          ))}
          {templates.shared.length === 0 && (
            <ListItem>
              <Typography color="text.secondary">
                No forms have been shared with you yet
              </Typography>
            </ListItem>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default Home;
