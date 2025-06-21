// config/multer.js
import multer from 'multer'
import { storage } from './cloudinary.js' // nếu dùng cloudinary, còn không thì storage là disk

const upload = multer({ storage })

export default upload
