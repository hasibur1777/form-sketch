const express = require('express');
const { userAuthenticate } = require('../middlewares/userMiddleware');
const {
  shareTemplate,
  getSharedForms,
} = require('../controllers/shareController');

const router = express.Router();

router.post(
  '/templates/:templateId/share',
  userAuthenticate,
  shareTemplate
);

router.get('/shared-with-me', userAuthenticate, getSharedForms);

module.exports = router;
