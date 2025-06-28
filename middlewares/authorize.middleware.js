/**
 * Middleware Phân quyền
 * Kiểm soát quyền truy cập tài nguyên dựa trên vai trò người dùng
 */

/**
 * Factory middleware tạo middleware phân quyền dựa trên vai trò
 * @param {...string} roles - Mảng các vai trò được phép
 * @returns {Function} Hàm middleware của Express
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        try {
            // Kiểm tra xem người dùng có tồn tại trong request không (được set bởi auth middleware)
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Yêu cầu xác thực.',
                    error: 'AUTHENTICATION_REQUIRED'
                });
            }

            // Kiểm tra xem người dùng có vai trò cần thiết không
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Truy cập bị từ chối. Không đủ quyền hạn.',
                    error: 'INSUFFICIENT_PERMISSIONS',
                    requiredRoles: roles,
                    userRole: req.user.role
                });
            }

            // Người dùng có vai trò cần thiết, tiếp tục
            next();
        } catch (error) {
            console.error('Lỗi middleware phân quyền:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi server trong quá trình phân quyền.',
                error: 'AUTHORIZATION_ERROR'
            });
        }
    };
};

export default authorize;