const express = require('express');
const {
    getAllUsers,
    getAllTransactions,
    verifyKYC,
    createOffer,
    getOffers,
    getDashboardStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// Offers are readable by any authenticated user
router.get('/offers', getOffers);

// Everything below requires admin role
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/transactions', getAllTransactions);
router.put('/kyc/:userId', verifyKYC);
router.post('/offers', createOffer);
router.get('/stats', getDashboardStats);

module.exports = router;
