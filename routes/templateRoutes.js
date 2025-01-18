const express = require('express');
const {
  getTemplates,
  createTemplate,
  getAllTemplates,
} = require('../controllers/templateController');
const { userAuthenticate } = require('../middlewares/userMiddleware');

const router = express.Router();

router.post('/', userAuthenticate, createTemplate);
router.get('/all', userAuthenticate, getAllTemplates);
router.get('/:templateID', userAuthenticate, getTemplates);

module.exports = router;
