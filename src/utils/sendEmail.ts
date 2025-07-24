
import nodemailer from 'nodemailer';

export async function sendAlertEmail(deviceName: string, toEmail: string, ipAddress: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.APP_EMAIL_GMAIL,
      pass: process.env.APP_PASSWORD_GMAIL, 
    },
  });

  const now = new Date().toLocaleString();

  const mailOptions = {
    from: 'your_email@gmail.com',
    to: toEmail,
    subject: `[THÔNG BÁO] Thiết bị ${deviceName} mất kết nối`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 16px; background-color: #fff; border-left: 4px solid #ff4d4f;">
        <h2 style="color: #ff4d4f;">🚨 CẢNH BÁO KHẨN CẤP</h2>
        <p>Thiết bị <b style="color: #000">${deviceName}</b> đã không phản hồi trong hơn <b>15 phút</b>.</p>
        <p><b>Địa chỉ IP:</b> ${ipAddress}</p>
        <p><b>Thời gian:</b> ${now}</p>
        <hr />
        <p style="font-size: 12px; color: gray;">Email tự động từ hệ thống giám sát</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
