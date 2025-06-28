// utils/paginate.js

/**
 * Utility xử lý phân trang cho các query MongoDB
 * Hỗ trợ lấy thông tin page, limit từ request query và tính toán skip
 */

/**
 * Tạo thông tin phân trang từ request query
 * @param {Object} query - MongoDB query object
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters từ URL
 * @param {string} req.query.page - Trang hiện tại (mặc định: 1)
 * @param {string} req.query.limit - Số lượng item mỗi trang (mặc định: 10)
 * @returns {Object} Thông tin phân trang và query đã được áp dụng
 * @returns {Object} returns.query - Query đã được áp dụng skip và limit
 * @returns {number} returns.page - Trang hiện tại
 * @returns {number} returns.limit - Số lượng item mỗi trang
 * @returns {number} returns.skip - Số lượng item cần bỏ qua
 */
const paginate = (query, req) => {
    // Lấy thông tin trang và giới hạn từ query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Tính toán số lượng item cần bỏ qua
    const skip = (page - 1) * limit;

    return {
        query: query.skip(skip).limit(limit), // Áp dụng skip và limit vào query
        page, // Trang hiện tại
        limit, // Số lượng item mỗi trang
        skip, // Số lượng item cần bỏ qua
    };
};

export default paginate;