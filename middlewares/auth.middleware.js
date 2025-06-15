import jwt from 'jsonwebtoken';

// Middleware xác thực JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    return next(new Error('Không có token xác thực'));
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401);
    next(new Error('Token không hợp lệ hoặc đã hết hạn'));
  }
};

export default authMiddleware;
