/**
 * Cấu hình Multer
 * Xử lý middleware upload file sử dụng Cloudinary storage
 */
import multer from 'multer'
import { storage } from './cloudinary.js' // nếu dùng cloudinary, còn không thì storage là disk

/**
 * Hàm lọc file để kiểm tra file upload
 * @param {Object} req - Đối tượng request của Express
 * @param {Object} file - Đối tượng file được upload
 * @param {Function} cb - Hàm callback
 */
const fileFilter = (req, file, cb) => {
    // Kiểm tra xem file có phải là hình ảnh không
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('❌ Chỉ cho phép upload file hình ảnh!'), false);
    }
};

/**
 * Cấu hình upload Multer
 * - Sử dụng Cloudinary storage để upload file
 * - Giới hạn kích thước file 5MB
 * - Chỉ cho phép file hình ảnh
 */
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
    },
    fileFilter,
});

export default upload