import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/user.routes.js';

dotenv.config(); // Load biến môi trường

connectDB(); // Kết nối database

const app = express();

app.use(express.json()); // Middleware parse JSON

// Đăng ký router cho endpoint /api/auth
app.use('/api/auth', authRoutes);

// Endpoint kiểm tra server
app.get('/', (req, res) => {
  res.send('API is running...');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});