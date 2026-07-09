const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverPhone: String,
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['send', 'receive', 'bill_payment', 'recharge', 'request'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    category: {
        type: String,
        enum: ['transfer', 'electricity', 'internet', 'mobile', 'other'],
        default: 'transfer'
    },
    description: String,
    reference: String,
    cashback: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
