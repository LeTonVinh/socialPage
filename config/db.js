// File: config/db.js
// Kết nối tới MongoDB sử dụng Mongoose và biến môi trường
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Kết nối tới MongoDB
 */
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: process.env.DB_POOL_SIZE ? parseInt(process.env.DB_POOL_SIZE) : 10,
            // Không cần useNewUrlParser và useUnifiedTopology nữa (Mongoose >= 6)
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;