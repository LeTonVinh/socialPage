import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/user.routes.js';
import passwordRoutes from './routes/password.routes.js';
import errorHandler from './middlewares/error.middleware.js';
const PORT = process.env.PORT || 30001;

dotenv.config(); // Load biến môi trường
connectDB(); // Kết nối database

const app = express();

app.use(express.json()); // Middleware parse JSON


app.use('/api/auth', authRoutes);
app.use('/api/password', passwordRoutes);

// Endpoint kiểm tra server
app.get('/', (req, res) => {
  res.send('API is running...');
});


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});