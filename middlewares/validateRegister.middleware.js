/**
 * Middleware Xác thực Đăng ký
 * Xác thực dữ liệu đăng ký người dùng trước khi xử lý
 */

/**
 * Xác thực dữ liệu đầu vào đăng ký người dùng
 * @param {Object} req - Đối tượng request của Express
 * @param {Object} res - Đối tượng response của Express
 * @param {Function} next - Hàm next của Express
 */
const validateRegister = (req, res, next) => {
    try {
        const { fullName, email, phone, birthday, password } = req.body;
        const errors = [];

        // Kiểm tra các trường bắt buộc
        if (!fullName || fullName.trim().length === 0) {
            errors.push('Họ tên là bắt buộc');
        }

        if (!email || email.trim().length === 0) {
            errors.push('Email là bắt buộc');
        }

        if (!phone || phone.trim().length === 0) {
            errors.push('Số điện thoại là bắt buộc');
        }

        if (!birthday) {
            errors.push('Ngày sinh là bắt buộc');
        }

        if (!password || password.trim().length === 0) {
            errors.push('Mật khẩu là bắt buộc');
        }

        // Xác thực định dạng email
        if (email && !isValidEmail(email)) {
            errors.push('Định dạng email không hợp lệ');
        }

        // Xác thực độ mạnh mật khẩu
        if (password && password.length < 6) {
            errors.push('Mật khẩu phải có ít nhất 6 ký tự');
        }

        // Xác thực định dạng số điện thoại (xác thực cơ bản)
        if (phone && !isValidPhone(phone)) {
            errors.push('Định dạng số điện thoại không hợp lệ');
        }

        // Xác thực ngày sinh (phải trong quá khứ)
        if (birthday && new Date(birthday) >= new Date()) {
            errors.push('Ngày sinh phải trong quá khứ');
        }

        // Nếu có lỗi xác thực, trả về danh sách lỗi
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Xác thực thất bại',
                errors,
                error: 'VALIDATION_ERROR'
            });
        }

        // Xác thực thành công, tiếp tục
        next();
    } catch (error) {
        console.error('Lỗi xác thực đăng ký:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server trong quá trình xác thực.',
            error: 'VALIDATION_ERROR'
        });
    }
};

/**
 * Xác thực định dạng email bằng regex
 * @param {string} email - Email cần xác thực
 * @returns {boolean} - True nếu hợp lệ, false nếu không
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Xác thực định dạng số điện thoại (xác thực cơ bản)
 * @param {string} phone - Số điện thoại cần xác thực
 * @returns {boolean} - True nếu hợp lệ, false nếu không
 */
const isValidPhone = (phone) => {
    // Loại bỏ tất cả ký tự không phải số
    const cleanPhone = phone.replace(/\D/g, '');
    // Kiểm tra độ dài từ 10-15 chữ số
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

export default validateRegister;