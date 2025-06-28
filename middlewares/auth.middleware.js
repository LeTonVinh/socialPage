/**
 * Middleware Xác thực
 * Xác thực JWT token và gắn thông tin người dùng vào request
 */
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

/**
 * Middleware xác thực JWT token
 * @param {Object} req - Đối tượng request của Express
 * @param {Object} res - Đối tượng response của Express
 * @param {Function} next - Hàm next của Express
 */
const authMiddleware = async(req, res, next) => {
    try {
        // Trích xuất token từ header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Truy cập bị từ chối. Không có token xác thực.',
                error: 'MISSING_TOKEN'
            });
        }

        // Trích xuất token từ "Bearer <token>"
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Định dạng token không hợp lệ.',
                error: 'INVALID_TOKEN_FORMAT'
            });
        }

        // Xác thực JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Tìm người dùng theo ID từ token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy người dùng.',
                error: 'USER_NOT_FOUND'
            });
        }

        // Kiểm tra phiên bản token (cho chức năng đăng xuất)
        if (user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({
                success: false,
                message: 'Token đã bị vô hiệu hóa. Vui lòng đăng nhập lại.',
                error: 'TOKEN_INVALIDATED'
            });
        }

        // Gắn thông tin người dùng vào request
        req.user = user;
        next();

    } catch (error) {
        // Xử lý các loại lỗi JWT khác nhau
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ.',
                error: 'INVALID_TOKEN'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token đã hết hạn. Vui lòng đăng nhập lại.',
                error: 'TOKEN_EXPIRED'
            });
        }

        // Xử lý các lỗi khác
        console.error('Lỗi middleware xác thực:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server trong quá trình xác thực.',
            error: 'AUTH_ERROR'
        });
    }
};

export default authMiddleware;