// Middleware kiểm tra dữ liệu đầu vào khi đăng ký
const validateRegister = (req, res, next) => {
  const { fullName, email, phone, birthday, password } = req.body;
  if (!fullName || !email || !phone || !birthday || !password) {
    res.status(400);
    return next(new Error('Vui lòng nhập đầy đủ thông tin'));
  }
  next();
};

export default validateRegister;
