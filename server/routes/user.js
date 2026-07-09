const express = require('express');
const {
    updateProfile,
    updatePassword,
    createBudget,
    getBudgets
} = require('../controllers/userController');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.post('/budget', createBudget);
router.get('/budget', getBudgets);

module.exports = router;
