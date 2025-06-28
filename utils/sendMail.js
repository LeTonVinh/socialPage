import nodemailer from 'nodemailer';

/**
 * Utility xử lý gửi email
 * Sử dụng nodemailer để gửi email thông qua Gmail SMTP
 */

/**
 * Gửi email chứa mã OTP đến người dùng
 * @param {string} to - Email người nhận
 * @param {string} otp - Mã OTP 6 số
 * @returns {Promise<void>} Promise hoàn thành khi gửi email thành công
 * @throws {Error} Lỗi khi không thể gửi email
 */
export const sendOTPEmail = async(to, otp) => {
    // Cấu hình transporter với Gmail SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Email gửi đi (từ biến môi trường)
            pass: process.env.EMAIL_PASS // Mật khẩu ứng dụng Gmail (App password)
        }
    });

    // Cấu hình nội dung email
    const mailOptions = {
        from: process.env.EMAIL_USER, // Email người gửi
        to, // Email người nhận
        subject: 'Mã OTP đặt lại mật khẩu', // Tiêu đề email
        text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 10 phút.` // Nội dung email
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
};