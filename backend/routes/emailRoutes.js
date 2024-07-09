const express = require('express');
const { fetchEmails, getEmailAnalytics } = require('../controllers/emailController');

const router = express.Router();

router.get('/fetch', fetchEmails);
router.get('/analytics', getEmailAnalytics);

module.exports = router;
