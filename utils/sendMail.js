import nodemailer from 'nodemailer';

// Hàm gửi email OTP
export const sendOTPEmail = async (to, otp) => {
  // Cấu hình transporter với Gmail (hoặc SMTP khác)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Email gửi đi
      pass: process.env.EMAIL_PASS  // Mật khẩu ứng dụng (App password)
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Mã OTP đặt lại mật khẩu',
    text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 10 phút.`
  };

  await transporter.sendMail(mailOptions);
};
