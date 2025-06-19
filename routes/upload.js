// 📄 routes/upload.js
import express from 'express'
import multer from 'multer'
import { storage } from '../config/cloudinary.js'

const router = express.Router()
const upload = multer({ storage })

// Endpoint để upload 1 ảnh
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file?.path) {
    return res.status(400).json({ message: 'Không có ảnh nào được upload.' })
  }

  res.json({ url: req.file.path }) // trả về URL ảnh
})

export default router
