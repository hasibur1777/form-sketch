const express = require('express');
const { userAuthenticate } = require('../middlewares/userMiddleware');
const {
  getTemplates,
  createTemplate,
  getAllTemplates,
  getTemplateResponses,
} = require('../controllers/templateController');

const router = express.Router();

router.post('/', userAuthenticate, createTemplate);
router.get('/all', userAuthenticate, getAllTemplates);
router.get('/:templateID', userAuthenticate, getTemplates);

router.get(
  '/:templateID/responses',
  userAuthenticate,
  getTemplateResponses
);

module.exports = router;
