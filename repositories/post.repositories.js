/**
 * Repository Quản lý Bài viết (Post Repository)
 * Chứa các hàm truy vấn và thao tác với collection Post trong database
 */
import Post from '../models/post.model.js';
import Follow from '../models/follow.model.js';

/**
 * Tạo mới một bài viết
 * @param {Object} data - Dữ liệu bài viết (content, images, author, ...)
 * @returns {Object} Bài viết vừa được tạo
 */
const create = async(data) => Post.create(data);

/**
 * Cập nhật bài viết (chỉ tác giả mới được sửa)
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID tác giả
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Object|null} Bài viết đã cập nhật hoặc null nếu không tìm thấy
 */
const update = async(postId, userId, updateData) =>
    Post.findOneAndUpdate({ _id: postId, author: userId, status: 'active' }, {...updateData, updatedAt: new Date() }, { new: true });

/**
 * Xóa mềm bài viết (chuyển trạng thái sang deleted)
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID tác giả
 * @returns {Object|null} Bài viết đã xóa hoặc null nếu không tìm thấy
 */
const remove = async(postId, userId) =>
    Post.findOneAndUpdate({ _id: postId, author: userId, status: 'active' }, { status: 'deleted', updatedAt: new Date() }, { new: true });

/**
 * Lấy bài viết theo ID
 * @param {String} postId - ID bài viết
 * @returns {Object|null} Bài viết nếu tìm thấy, ngược lại trả về null
 */
const findById = async(postId) => Post.findById(postId);

/**
 * Lấy tất cả bài viết active, public (có thể truyền thêm filter)
 * @param {Object} filter - Điều kiện lọc (ví dụ: theo author, tags, ...)
 * @returns {Array} Danh sách bài viết
 */
const findAll = async(filter = {}) =>
    Post.find({ status: 'active', privacy: 'public', ...filter })
    .populate('author', 'fullName avatar')
    .populate({
        path: 'sharedPost',
        populate: { path: 'author', select: 'fullName avatar' }
    })
    .sort({ createdAt: -1 });

/**
 * Lấy tất cả bài viết (gốc và share) của người dùng hiện tại
 * @param {String} userId - ID người dùng
 * @returns {Array} Danh sách bài viết của người dùng
 */
const findAllByCurrentUser = async(userId) =>
    Post.find({ status: 'active', author: userId })
    .populate('sharedPost')
    .populate({
        path: 'sharedPost',
        populate: { path: 'author', select: 'fullName avatar' }
    })
    .populate('author', 'fullName avatar')
    .sort({ createdAt: -1 });

/**
 * Thêm lượt thích cho bài viết
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID người dùng thích
 * @returns {Object|null} Bài viết sau khi thêm like
 */
const addLike = async(postId, userId) =>
    Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });

/**
 * Bỏ lượt thích cho bài viết
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID người dùng bỏ thích
 * @returns {Object|null} Bài viết sau khi bỏ like
 */
const removeLike = async(postId, userId) =>
    Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });

/**
 * Thêm lượt xem cho bài viết
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID người dùng xem
 * @returns {Object|null} Bài viết sau khi thêm view
 */
const addView = async(postId, userId) =>
    Post.findByIdAndUpdate(postId, { $addToSet: { views: userId } }, { new: true });

/**
 * Thêm lượt chia sẻ cho bài viết
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID người dùng chia sẻ
 * @returns {Object|null} Bài viết sau khi thêm share
 */
const addShare = async(postId, userId) =>
    Post.findByIdAndUpdate(postId, { $addToSet: { shares: userId } }, { new: true });

/**
 * Đếm số bài viết của một tác giả trong khoảng thời gian
 * @param {String} authorId - ID tác giả
 * @param {Date} fromTime - Thời gian bắt đầu
 * @returns {Number} Số lượng bài viết
 */
const countByAuthorAndTime = async(authorId, fromTime) =>
    Post.countDocuments({
        author: authorId,
        createdAt: { $gte: fromTime },
        status: 'active'
    });

/**
 * Kiểm tra quyền truy cập bài viết
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID người dùng cần kiểm tra
 * @returns {Object} Kết quả kiểm tra quyền truy cập
 */
const checkPostAccess = async(postId, userId) => {
    const post = await Post.findById(postId).populate('author', '_id');

    if (!post || post.status !== 'active') {
        return { hasAccess: false, reason: 'Post not found or inactive' };
    }

    // Nếu là tác giả bài viết
    if (post.author._id.toString() === userId) {
        return { hasAccess: true, post };
    }

    // Nếu bài viết là public
    if (post.privacy === 'public') {
        return { hasAccess: true, post };
    }

    // Nếu bài viết là private
    if (post.privacy === 'private') {
        return { hasAccess: false, reason: 'Private post' };
    }

    // Nếu bài viết là follower only
    if (post.privacy === 'follower') {
        const isFollowing = await Follow.findOne({
            follower: userId,
            following: post.author._id
        });

        return {
            hasAccess: !!isFollowing,
            post,
            reason: !isFollowing ? 'Must follow author to view' : null
        };
    }

    return { hasAccess: false, reason: 'Unknown privacy setting' };
};

/**
 * Đếm tổng số bài viết theo điều kiện
 * @param {Object} filter - Điều kiện lọc
 * @returns {Number} Tổng số bài viết
 */
const countAll = async(filter = {}) => {
    return await Post.countDocuments({ status: 'active', ...filter });
};

/**
 * Lấy danh sách bài viết có phân trang
 * @param {Number} skip - Số bài viết bỏ qua
 * @param {Number} limit - Số bài viết lấy
 * @param {Object} filter - Điều kiện lọc
 * @returns {Array} Danh sách bài viết
 */
const findAllPaginated = async(skip, limit, filter = {}) => {
    return await Post.find({ status: 'active', privacy: 'public', ...filter })
        .populate('author', 'fullName avatar')
        .populate({
            path: 'sharedPost',
            populate: { path: 'author', select: 'fullName avatar' }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

/**
 * Lấy tất cả bài viết active của một người dùng
 * @param {String} userId - ID người dùng
 * @returns {Array} Danh sách bài viết của người dùng
 */
const findAllByUser = async(userId) =>
    Post.find({ author: userId, status: 'active' })
    .populate('author', 'fullName avatar username')
    .populate({
        path: 'sharedPost',
        populate: { path: 'author', select: 'fullName avatar' }
    })
    .sort({ createdAt: -1 });

export default {
    create,
    update,
    remove,
    findById,
    findAll,
    findAllByCurrentUser,
    addLike,
    removeLike,
    addView,
    addShare,
    countByAuthorAndTime,
    countAll,
    findAllPaginated,
    checkPostAccess,
    findAllByUser
};