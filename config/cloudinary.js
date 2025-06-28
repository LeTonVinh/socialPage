/**
 * Cấu hình Cloudinary
 * Xử lý upload và lưu trữ hình ảnh trên cloud
 */
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import dotenv from 'dotenv'

dotenv.config()

// Kiểm tra các biến môi trường bắt buộc
const requiredEnvVars = ['CLOUDINARY_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
    console.error('❌ Thiếu các biến môi trường Cloudinary:', missingVars)
    process.exit(1)
}

/**
 * Cấu hình Cloudinary với thông tin từ biến môi trường
 */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, // Tên cloud
    api_key: process.env.CLOUDINARY_API_KEY, // API key
    api_secret: process.env.CLOUDINARY_API_SECRET, // API secret
})

/**
 * Cấu hình lưu trữ Cloudinary cho Multer
 * Xử lý cài đặt upload file và giới hạn
 */
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'social-posts', // Thư mục lưu trữ trên Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Định dạng file được phép
        transformation: [
            { width: 1000, height: 1000, crop: 'limit' }, // Giới hạn kích thước hình ảnh
            { quality: 'auto' }, // Tự động tối ưu chất lượng
        ]
    }
})

export { cloudinary, storage }