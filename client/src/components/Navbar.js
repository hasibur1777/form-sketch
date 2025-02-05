import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = isLoggedIn
    ? [
        { text: 'Home', path: '/home' },
        { text: 'Profile', path: '/profile' },
        { text: 'Logout', action: handleLogout },
      ]
    : [
        { text: 'Login', path: '/login' },
        { text: 'Register', path: '/register' },
      ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { sm: 'none' } }} // Hide on larger screens
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            My App
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {' '}
            {/* Show on larger screens */}
            {menuItems.map((item, index) =>
              item.action ? (
                <Button
                  key={index}
                  color="inherit"
                  onClick={item.action}
                >
                  {item.text}
                </Button>
              ) : (
                <Button
                  key={index}
                  color="inherit"
                  component={Link}
                  to={item.path}
                >
                  {item.text}
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ display: { sm: 'none' } }} // Show on small screens
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item, index) =>
              item.action ? (
                <ListItem button key={index} onClick={item.action}>
                  <ListItemText primary={item.text} />
                </ListItem>
              ) : (
                <ListItem
                  button
                  key={index}
                  component={Link}
                  to={item.path}
                >
                  <ListItemText primary={item.text} />
                </ListItem>
              )
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
