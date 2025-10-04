const express = require('express');
const { userAuthenticate } = require('../middlewares/userMiddleware');
const {
  getTemplate,
  createTemplate,
  getAllTemplates,
  getTemplateResponses,
} = require('../controllers/templateController');

const router = express.Router();

router.post('/', userAuthenticate, createTemplate);
router.get('/all', userAuthenticate, getAllTemplates);
router.get('/:templateId', userAuthenticate, getTemplate);
router.get(
  '/:templateId/responses',
  userAuthenticate,
  getTemplateResponses
);

module.exports = router;
