const express = require('express');
const router = express.Router();
const { setupUser, getUser } = require('../controllers/userController');

router.post('/setup', setupUser);
router.get('/:userId', getUser);

module.exports = router;
