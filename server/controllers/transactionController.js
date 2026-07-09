const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Lightweight error that carries an HTTP status, so business-rule failures
// thrown inside the transaction surface with the right code (400/404 vs 500).
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

exports.sendMoney = async (req, res) => {
    // Validate input up front, before opening any DB session.
    const { receiverPhone, amount, description } = req.body;
    const numericAmount = parseFloat(amount);

    if (!receiverPhone || Number.isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Valid receiver phone and amount are required' });
    }

    // A session lets us group the debit, credit, and transaction record into
    // a single atomic unit: they all commit together or all roll back. This
    // requires a MongoDB replica set (Atlas provides one by default).
    const session = await mongoose.startSession();

    try {
        let transaction;
        let newSenderBalance;

        await session.withTransaction(async () => {
            const sender = await User.findById(req.user.id).session(session);
            if (!sender) {
                throw new AppError('Sender not found', 404);
            }

            if (sender.phone === receiverPhone) {
                throw new AppError('You cannot send money to yourself', 400);
            }

            const receiver = await User.findOne({ phone: receiverPhone }).session(session);
            if (!receiver) {
                throw new AppError('Receiver not found', 404);
            }

            if (sender.balance < numericAmount) {
                throw new AppError('Insufficient balance', 400);
            }

            sender.balance -= numericAmount;
            receiver.balance += numericAmount;
            await sender.save({ session });
            await receiver.save({ session });

            // create() with a session must be passed an array.
            const [created] = await Transaction.create([{
                sender: sender._id,
                receiver: receiver._id,
                receiverPhone,
                amount: numericAmount,
                type: 'send',
                description,
                status: 'completed'
            }], { session });

            transaction = created;
            newSenderBalance = sender.balance;
        });

        res.status(201).json({ success: true, transaction, balance: newSenderBalance });
    } catch (error) {
        // Business-rule errors carry their own status; anything else is a 500.
        const status = error.statusCode || 500;
        res.status(status).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, startDate, endDate } = req.query;
        const query = {
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        };
        if (type) query.type = type;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(query)
            .populate('sender', 'name phone')
            .populate('receiver', 'name phone')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Transaction.countDocuments(query);

        res.status(200).json({
            success: true,
            transactions,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const transactions = await Transaction.find({
            $or: [{ sender: userId }, { receiver: userId }],
            createdAt: { $gte: thirtyDaysAgo }
        });

        const spending = {};
        const income = {};
        const categorySpending = {};

        transactions.forEach((t) => {
            const day = t.createdAt.toISOString().split('T')[0];
            if (t.sender.toString() === userId.toString()) {
                spending[day] = (spending[day] || 0) + t.amount;
                categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
            } else {
                income[day] = (income[day] || 0) + t.amount;
            }
        });

        res.status(200).json({
            success: true,
            analytics: { spending, income, categorySpending }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
