const express = require('express');
const router = express.Router();
const {
  userAuthenticate,
  getUser,
} = require('../middlewares/userMiddleware');
const {
  createUser,
  loginUser,
} = require('../controllers/userController');

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/profile', userAuthenticate, getUser);
router.post('/logout', (req, res) =>
  res.json({ message: 'Logout Successful!' })
);

module.exports = router;
