// Middleware xử lý lỗi tổng quát cho toàn bộ API
const errorHandler = (err, req, res, next) => {
  // Nếu statusCode chưa được set hoặc là 200 thì trả về 500
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Server Error',
    // Chỉ trả về stack trace khi ở môi trường development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorHandler;
