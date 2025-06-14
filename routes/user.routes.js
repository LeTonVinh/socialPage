import express from 'express';
import { register, login } from '../controllers/user.controller.js';
import validateRegister from '../middlewares/validateRegister.middleware.js';

const router = express.Router();

router.route('/register')
  .post(register, validateRegister); // Thêm middleware validateRegister

router.route('/login')
  .post(login);

export default router;