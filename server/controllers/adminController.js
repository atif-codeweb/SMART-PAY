const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Offer = require('../models/Offer');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('sender', 'name phone')
            .populate('receiver', 'name phone')
            .sort({ createdAt: -1 })
            .limit(200);
        res.status(200).json({ success: true, count: transactions.length, transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyKYC = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { isKYCVerified: true },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createOffer = async (req, res) => {
    try {
        const offer = await Offer.create(req.body);
        res.status(201).json({ success: true, offer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOffers = async (req, res) => {
    try {
        const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, offers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const verifiedUsers = await User.countDocuments({ isKYCVerified: true });
        const totalTransactions = await Transaction.countDocuments();

        const volumeAgg = await Transaction.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalVolume = volumeAgg[0]?.total || 0;

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                verifiedUsers,
                totalTransactions,
                totalVolume
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
