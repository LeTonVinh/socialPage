// Middleware phân quyền theo role
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error('Bạn không có quyền truy cập tài nguyên này'));
  }
  next();
};

export default authorize;
