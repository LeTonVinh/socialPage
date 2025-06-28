// 📄 routes/upload.js
/**
 * Routes Upload File (Upload Routes)
 * Định nghĩa các endpoint liên quan đến upload file lên Cloudinary
 */
import express from 'express'
import multer from 'multer'
import { storage } from '../config/cloudinary.js'

const router = express.Router()
const upload = multer({ storage })

/**
 * Upload một hình ảnh lên Cloudinary
 * @route POST /api/upload
 * @access Public
 * @param {File} image - File hình ảnh cần upload
 * @returns {Object} URL của hình ảnh đã upload
 */
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file ? .path) {
        return res.status(400).json({ message: 'Không có ảnh nào được upload.' })
    }

    res.json({
            url: req.file.path,
            message: 'Upload ảnh thành công'
        }) // trả về URL ảnh
})

export default router