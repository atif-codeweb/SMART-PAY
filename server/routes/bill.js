const express = require('express');
const { payBill, getSavedBills } = require('../controllers/billController');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/pay', payBill);
router.get('/saved', getSavedBills);

module.exports = router;
