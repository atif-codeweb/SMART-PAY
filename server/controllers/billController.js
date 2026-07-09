const Bill = require('../models/Bill');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.payBill = async (req, res) => {
    try {
        const { type, billerName, accountNumber, amount, isSaved } = req.body;
        const numericAmount = parseFloat(amount);

        if (!billerName || !accountNumber || !numericAmount || numericAmount <= 0) {
            return res.status(400).json({ success: false, message: 'All bill fields are required' });
        }

        const user = await User.findById(req.user.id);
        if (user.balance < numericAmount) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }

        // 5% cashback on bill payments (capped at 100)
        const cashback = Math.min(Math.round(numericAmount * 0.05), 100);

        user.balance -= numericAmount;
        user.balance += cashback;
        user.rewardPoints += Math.floor(numericAmount / 100);
        await user.save();

        const transaction = await Transaction.create({
            sender: user._id,
            amount: numericAmount,
            type: 'bill_payment',
            category: ['electricity', 'internet', 'mobile'].includes(type) ? type : 'other',
            description: `${billerName} bill`,
            status: 'completed',
            cashback
        });

        if (isSaved) {
            const exists = await Bill.findOne({ user: user._id, accountNumber });
            if (!exists) {
                await Bill.create({ user: user._id, type, billerName, accountNumber, lastAmount: numericAmount, isSaved: true });
            }
        }

        res.status(201).json({ success: true, transaction, balance: user.balance, cashback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSavedBills = async (req, res) => {
    try {
        const bills = await Bill.find({ user: req.user.id, isSaved: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, bills });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
