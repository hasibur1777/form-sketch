const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUser,
  userProfile,
} = require('../controllers/userController');

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/profile', userProfile);
router.post('/logout', (req, res) =>
  res.json({ message: 'Logout Successful!' })
);

module.exports = router;
