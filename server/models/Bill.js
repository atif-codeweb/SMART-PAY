const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['electricity', 'internet', 'mobile', 'other'],
        default: 'electricity'
    },
    billerName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    lastAmount: Number,
    isSaved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bill', billSchema);
