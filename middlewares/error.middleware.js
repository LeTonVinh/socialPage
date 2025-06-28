/**
 * Middleware Xử lý Lỗi Toàn cục
 * Xử lý lỗi tập trung cho tất cả các endpoint API
 */

/**
 * Xử lý tất cả lỗi được throw trong ứng dụng
 * @param {Error} err - Đối tượng lỗi
 * @param {Object} req - Đối tượng request của Express
 * @param {Object} res - Đối tượng response của Express
 * @param {Function} next - Hàm next của Express
 */
const errorHandler = (err, req, res, next) => {
    // Xác định mã trạng thái (mặc định 500 nếu chưa được set)
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    // Tạo đối tượng response lỗi
    const errorResponse = {
        success: false,
        message: err.message || 'Lỗi Server Nội bộ',
        statusCode,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method,
    };

    // Thêm stack trace chỉ trong môi trường development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
        errorResponse.error = err;
    }

    // Ghi log lỗi để debug
    console.error('🚨 Đã xảy ra lỗi:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        statusCode,
        timestamp: new Date().toISOString(),
    });

    // Gửi response lỗi
    res.status(statusCode).json(errorResponse);
};

export default errorHandler;