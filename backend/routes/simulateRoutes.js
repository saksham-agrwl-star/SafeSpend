const express = require('express');
const router = express.Router();
const { simulateTransaction } = require('../controllers/simulateController');

router.post('/', simulateTransaction);

module.exports = router;
