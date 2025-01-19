const express = require('express');
const { userAuthenticate } = require('../middlewares/userMiddleware');

const {
  createResponse,
  getResponse,
  getAllResponses,
} = require('../controllers/responseController');

const router = express.Router();

router.post('/', userAuthenticate, createResponse);
router.get('/all', userAuthenticate, getAllResponses);
router.get('/:id', userAuthenticate, getResponse);

module.exports = router;
