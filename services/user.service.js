import userRepo from '../repos/user.repo.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Kiểm tra định dạng email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Kiểm tra định dạng số điện thoại (Việt Nam)
const isValidPhone = (phone) => /^(0|\+84)[0-9]{9,10}$/.test(phone);

// Kiểm tra mật khẩu mạnh (ít nhất 8 ký tự, có chữ hoa, thường, số)
const isStrongPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const register = async ({ fullName, email, phone, birthday, password, role }) => {
  // Kiểm tra dữ liệu đầu vào
  if (!fullName || !email || !phone || !birthday || !password)
    throw new Error('Vui lòng nhập đầy đủ thông tin');

  if (!isValidEmail(email)) throw new Error('Email không hợp lệ');
  if (!isValidPhone(phone)) throw new Error('Số điện thoại không hợp lệ');
  if (!isStrongPassword(password))
    throw new Error('Mật khẩu phải tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số');

  // Kiểm tra trùng lặp
  const existingUser = await userRepo.findByEmailOrPhone(email, phone);
  if (existingUser) throw new Error('Email hoặc số điện thoại đã tồn tại');

  // Hash mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo user mới
  const user = await userRepo.createUser({
    fullName,
    email,
    phone,
    birthday,
    password: hashedPassword,
    role: role || 'user'
  });

  return user;
};

const login = async ({ phone, password }) => {
  const user = await userRepo.findByPhone(phone);
  if (!user) throw new Error('Số điện thoại không tồn tại');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Sai mật khẩu');

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'; // Lấy từ env, mặc định 7d

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET ,
    { expiresIn }
  );
  return { user, token };
};

export default { register, login };