// File: config/db.js
// Kết nối tới MongoDB sử dụng Mongoose và biến môi trường
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Cấu hình cơ sở dữ liệu MongoDB
 * Xử lý kết nối database sử dụng Mongoose
 */

/**
 * Kết nối đến cơ sở dữ liệu MongoDB
 * @returns {Promise<void>}
 */
const connectDB = async() => {
    try {
        const mongoURI = process.env.MONGO_URI;

        // Kiểm tra biến môi trường MONGO_URI
        if (!mongoURI) {
            throw new Error('Biến môi trường MONGO_URI chưa được định nghĩa');
        }

        // Cấu hình tùy chọn kết nối MongoDB
        const connectionOptions = {
            maxPoolSize: process.env.DB_POOL_SIZE ? parseInt(process.env.DB_POOL_SIZE) : 10, // Số lượng kết nối tối đa
            serverSelectionTimeoutMS: 5000, // Timeout chọn server sau 5 giây
            socketTimeoutMS: 45000, // Đóng socket sau 45 giây không hoạt động
            bufferMaxEntries: 0, // Tắt buffer của mongoose
        };

        // Thực hiện kết nối
        await mongoose.connect(mongoURI, connectionOptions);

        console.log('✅ Đã kết nối thành công MongoDB');

        // Xử lý các sự kiện kết nối
        mongoose.connection.on('error', (err) => {
            console.error('❌ Lỗi kết nối MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB đã ngắt kết nối');
        });

        // Xử lý tắt server an toàn
        process.on('SIGINT', async() => {
            await mongoose.connection.close();
            console.log('🔄 Đã đóng kết nối MongoDB khi tắt ứng dụng');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Không thể kết nối MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectDB;