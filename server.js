import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; 

// Kết nối tới MongoDB
connectDB();
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());




app.get('/', (req, res) => {
  res.send('Hello from Express ES6!');
});







app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});