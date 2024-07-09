const express = require('express');
const { authenticateGoogle } = require('../controllers/authController');

const router = express.Router();

router.post('/google', authenticateGoogle);

module.exports = router;
