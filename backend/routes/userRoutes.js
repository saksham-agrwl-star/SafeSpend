const express = require('express');
const router = express.Router();
const { setupUser, getUser, loginUser, createGoal, updateBudget } = require('../controllers/userController');

router.post('/setup', setupUser);
router.post('/login', loginUser);
router.get('/:userId', getUser);
router.post('/goals', createGoal);
router.put('/:userId/budget', updateBudget);

module.exports = router;

