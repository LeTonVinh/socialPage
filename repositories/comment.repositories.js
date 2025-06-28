/**
 * Repository Quản lý Bình luận (Comment Repository)
 * Chứa các hàm truy vấn và thao tác với collection Comment trong database
 */
import Comment from '../models/comment.model.js';

/**
 * Tạo bình luận mới (có thể là bình luận gốc hoặc reply)
 * @param {Object} data - Dữ liệu bình luận
 * @returns {Object} Bình luận vừa được tạo
 */
const create = async(data) => {
    const comment = await Comment.create(data);

    // Nếu là reply comment, tăng replyCount của parent comment
    if (data.parentComment) {
        await Comment.findByIdAndUpdate(
            data.parentComment, { $inc: { replyCount: 1 } }
        );
    }

    return comment;
};

/**
 * Lấy bình luận gốc của một bài viết (không bao gồm replies)
 * @param {String} postId - ID bài viết
 * @param {Number} page - Số trang (mặc định 1)
 * @param {Number} limit - Số lượng bình luận mỗi trang
 * @returns {Array} Danh sách bình luận gốc
 */
const findRootCommentsByPost = async(postId, page = 1, limit) => {
    let query = Comment.find({
            post: postId,
            parentComment: null,
            status: 'active'
        })
        .populate('author', 'fullName avatar')
        .sort({ createdAt: -1 });

    if (limit) {
        // Chỉ phân trang khi có limit
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
    }

    return await query;
};

/**
 * Lấy replies của một bình luận
 * @param {String} commentId - ID bình luận cha
 * @param {Number} page - Số trang (mặc định 1)
 * @param {Number} limit - Số lượng reply mỗi trang
 * @returns {Array} Danh sách replies
 */
const findRepliesByComment = async(commentId, page = 1, limit) => {
    const skip = (page - 1) * limit;

    return await Comment.find({
            parentComment: commentId,
            status: 'active'
        })
        .populate('author', 'fullName avatar')
        .sort({ createdAt: 1 }) // Replies sắp xếp theo thời gian tăng dần
        .skip(skip)
        .limit(limit);
};

/**
 * Đếm tổng số bình luận của một bài viết
 * @param {String} postId - ID bài viết
 * @returns {Number} Tổng số bình luận
 */
const countCommentsByPost = async(postId) => {
    return await Comment.countDocuments({
        post: postId,
        status: 'active'
    });
};

/**
 * Thích/Bỏ thích bình luận
 * @param {String} commentId - ID bình luận
 * @param {String} userId - ID người dùng
 * @returns {Object} Kết quả thao tác và số lượng like
 */
const toggleLike = async(commentId, userId) => {
    const comment = await Comment.findById(commentId);

    if (comment.likes.includes(userId)) {
        // Bỏ thích
        await Comment.findByIdAndUpdate(commentId, {
            $pull: { likes: userId }
        });
        return { action: 'unliked', likesCount: comment.likes.length - 1 };
    } else {
        // Thích
        await Comment.findByIdAndUpdate(commentId, {
            $addToSet: { likes: userId }
        });
        return { action: 'liked', likesCount: comment.likes.length + 1 };
    }
};

/**
 * Xóa bình luận (soft delete)
 * @param {String} commentId - ID bình luận
 * @returns {Object} Bình luận đã được xóa
 */
const softDelete = async(commentId) => {
    return await Comment.findByIdAndUpdate(
        commentId, {
            status: 'deleted',
            content: '[Bình luận đã bị xóa]',
            updatedAt: new Date()
        }
    );
};

/**
 * Tìm bình luận theo ID
 * @param {String} id - ID bình luận
 * @returns {Object|null} Bình luận nếu tìm thấy
 */
const findById = async(id) => Comment.findById(id);

export default {
    create,
    findRootCommentsByPost,
    findRepliesByComment,
    countCommentsByPost,
    toggleLike,
    softDelete,
    findById
};