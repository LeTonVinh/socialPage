import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName:   { type: String, required: true }, // Tên đầy đủ
  email:      { type: String, required: true, unique: true }, // Email phải duy nhất
  phone:      { type: String, required: true, unique: true }, // Số điện thoại phải duy nhất
  birthday:   { type: Date, required: true }, // Ngày sinh
  password:   { type: String, required: true }, // Mật khẩu đã được mã hóa
  role:       { type: String, enum: ['user', 'admin'], default: 'user' }, // Thêm role
  createdAt:  { type: Date, default: Date.now }, // Thời gian tạo tài khoản
  resetOTP:   { type: String }, // OTP đặt lại mật khẩu
  resetOTPExpire: { type: Date }, // Thời gian hết hạn OTP
  avatar: { type: String, default: '' },      // Đường dẫn hoặc URL ảnh đại diện
  coverImage: { type: String, default: '' },  // Đường dẫn hoặc URL ảnh bìa
  gender: { type: String, enum: ['male', 'female', 'other'] }, // Giới tính
  address: String, // Địa chỉ dạng chuỗi
  bio: String, // Tiểu sử ngắn
  occupation: String, // Nghề nghiệp
  education: String, // Trình độ học vấn
  relationshipStatus: { type: String, enum: ['single', 'married', 'other'] }, // Tình trạng mối quan hệ
  interests: [String], // Sở thích, lưu dưới dạng mảng chuỗi
  socialLinks: {
    facebook: String,
    instagram: String,
    // Thêm các mạng xã hội khác nếu cần
  },
  updatedAt: { type: Date, default: Date.now },
  tokenVersion: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);
export default User;