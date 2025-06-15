import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Middleware xác thực JWT
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    return next(new Error('Không có token xác thực'));
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    const user = await User.findById(decoded.id);

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ message: 'Token đã hết hiệu lực. Vui lòng đăng nhập lại.' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    next(new Error('Token không hợp lệ hoặc đã hết hạn'));
  }
};

export default authMiddleware;
