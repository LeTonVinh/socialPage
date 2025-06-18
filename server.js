import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/user.routes.js';
import passwordRoutes from './routes/password.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from './routes/comment.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import followRoutes from './routes/follow.routes.js';
import cors from 'cors';
const PORT = process.env.PORT ;

dotenv.config(); // Load biến môi trường
connectDB(); // Kết nối database

const app = express();

app.use(express.json()); // Middleware parse JSON
app.use(cors({
  origin: 'http://localhost:5173', // Cho phép frontend kết nối
  credentials: true                // Nếu bạn dùng cookie
}))

app.use('/api/auth', authRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/users', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/follows', followRoutes);
// Endpoint kiểm tra server
app.get('/', (req, res) => {
  res.send('API is running...');
});


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});