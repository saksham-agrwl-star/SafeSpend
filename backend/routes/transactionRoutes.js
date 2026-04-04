const express = require('express');
const router = express.Router();
const { scanTransaction, addTransaction } = require('../controllers/transactionController');

router.post('/scan', scanTransaction);
router.post('/add', addTransaction);

module.exports = router;
