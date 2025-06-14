import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName:   { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  phone:      { type: String, required: true, unique: true },
  birthday:   { type: Date, required: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['user', 'admin'], default: 'user' }, // Thêm role
  createdAt:  { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;