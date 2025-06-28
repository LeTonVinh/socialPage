import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import errorHandler from './middlewares/error.middleware.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

// Import các route modules
import authRoutes from './routes/user.routes.js';
import passwordRoutes from './routes/password.routes.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from './routes/comment.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import followRoutes from './routes/follow.routes.js';
import uploadRoute from './routes/upload.js';

// Tải biến môi trường từ file .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 5000;

// Kết nối cơ sở dữ liệu MongoDB
connectDB();

// Cấu hình middleware cơ bản
app.use(express.json()); // Xử lý dữ liệu JSON từ request
app.use(express.urlencoded({ extended: true })); // Xử lý dữ liệu form

// Cấu hình CORS để cho phép frontend kết nối
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // URL của frontend
    credentials: true // Cho phép gửi cookies/session
}));

// Swagger UI
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Định nghĩa các route API
app.use('/api/auth', authRoutes); // Route xác thực người dùng
app.use('/api/password', passwordRoutes); // Route quản lý mật khẩu
app.use('/api/users', authRoutes); // Route quản lý người dùng
app.use('/api/posts', postRoutes); // Route quản lý bài viết
app.use('/api/comments', commentRoutes); // Route quản lý bình luận
app.use('/api/notifications', notificationRoutes); // Route thông báo
app.use('/api/follows', followRoutes); // Route theo dõi người dùng
app.use('/api/upload', uploadRoute); // Route upload file

// Endpoint kiểm tra trạng thái server
app.get('/', (req, res) => {
    res.json({
        message: 'API Mạng xã hội đang hoạt động...',
        status: 'success',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Middleware xử lý lỗi toàn cục (phải đặt cuối cùng)
app.use(errorHandler);

// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
    console.log(`📱 API Documentation: http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});