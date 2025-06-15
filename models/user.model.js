import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName:   { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  phone:      { type: String, required: true, unique: true },
  birthday:   { type: Date, required: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['user', 'admin'], default: 'user' }, // Thêm role
  createdAt:  { type: Date, default: Date.now },
  resetOTP:   { type: String }, // OTP đặt lại mật khẩu
  resetOTPExpire: { type: Date }, // Thời gian hết hạn OTP
  avatar: { type: String, default: '' },      // Đường dẫn hoặc URL ảnh đại diện
  coverImage: { type: String, default: '' },  // Đường dẫn hoặc URL ảnh bìa
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: String, // Địa chỉ dạng chuỗi
  bio: String,
  occupation: String,
  education: String,
  relationshipStatus: { type: String, enum: ['single', 'married', 'other'] },
  interests: [String],
  socialLinks: {
    facebook: String,
    instagram: String,
    // Thêm các mạng xã hội khác nếu cần
  },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
export default User;