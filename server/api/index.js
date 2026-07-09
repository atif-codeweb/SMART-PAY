// Vercel serverless entry point for the Express API.
// Local development still uses server.js — this file is only for Vercel.
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../app');

// Cache the Mongo connection across warm invocations so we don't open a new
// connection on every request (a common serverless pitfall that exhausts the
// Atlas connection pool). Reuse the live connection when readyState === 1.
let cached = global._mongoClientPromise;

async function connectDB() {
    if (mongoose.connection.readyState === 1) return;
    if (!cached) {
        cached = mongoose.connect(process.env.MONGO_URI, {
            bufferCommands: false
        });
        global._mongoClientPromise = cached;
    }
    await cached;
}

module.exports = async (req, res) => {
    try {
        await connectDB();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Database connection failed: ' + error.message
        });
    }
    return app(req, res);
};
