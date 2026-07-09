const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone, avatar } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                balance: user.balance,
                rewardPoints: user.rewardPoints
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Both current and new password are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
        }

        const user = await User.findById(req.user.id);
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createBudget = async (req, res) => {
    try {
        const { category, limit, month } = req.body;
        if (!category || !limit) {
            return res.status(400).json({ success: false, message: 'Category and limit are required' });
        }

        const user = await User.findById(req.user.id);
        const currentMonth = month || new Date().toISOString().slice(0, 7);

        const existing = user.budgets.find(
            (b) => b.category === category && b.month === currentMonth
        );

        if (existing) {
            existing.limit = limit;
        } else {
            user.budgets.push({ category, limit, spent: 0, month: currentMonth });
        }

        await user.save();
        res.status(201).json({ success: true, budgets: user.budgets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getBudgets = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('budgets');
        res.status(200).json({ success: true, budgets: user.budgets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
