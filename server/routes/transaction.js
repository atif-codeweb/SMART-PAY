const express=require('express');
const {sendMoney,getTransactions,getAnalytics}=require('../controllers/transactionController');
const protect=require('../middleware/auth');

const router=express.Router();

router.use(protect);

router.post('/send',sendMoney);
router.get('/',getTransactions);
router.get('/analytics',getAnalytics)

module.exports=router;