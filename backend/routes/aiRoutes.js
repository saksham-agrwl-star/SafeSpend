const express = require('express');
const router = express.Router();
const { aiCheck } = require('../controllers/aiController');

router.post('/', aiCheck);

module.exports = router;
