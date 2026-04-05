const express = require('express');
const router = express.Router();
const { setupUser, getUser, loginUser, createGoal, updateBudget, updateGoal, deleteGoal } = require('../controllers/userController');

router.post('/setup', setupUser);
router.post('/login', loginUser);
router.get('/:userId', getUser);
router.post('/goals', createGoal);
router.put('/:userId/goals/:goalId', updateGoal);
router.delete('/:userId/goals/:goalId', deleteGoal);
router.put('/:userId/budget', updateBudget);

module.exports = router;

