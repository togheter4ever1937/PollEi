const cors = require("cors");
const nodemailer = require("nodemailer");
const { use } = require("../routes/signup");

function mailSender(code, user) {
  const mail = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "elharthamza8@gmail.com",
      pass: "gsht dkxe cnvb loiy",
    },
  });
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: `${user.username} <${user.email}>`,
    replyTo: "", // You can add a reply-to email address if needed
    subject: "Verification Code",
    html: `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f7fa; padding: 20px;">
        <table role="presentation" style="width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 20px; text-align: center;">
              <h2 style="color: #333;">Verify Your Email</h2>
              <p style="font-size: 16px; color: #555;">Hi ${user.username},</p>
              <p style="font-size: 14px; color: #555;">Thank you for registering with us. To complete your sign-up process, please use the following verification code:</p>
              <h3 style="background-color: #4CAF50; color: white; padding: 15px; border-radius: 5px; display: inline-block; font-size:28px">
                ${code}
              </h3>
              <p style="font-size: 14px; color: #555;">If you didn't request this, please ignore this email.</p>
              <p style="font-size: 12px; color: #888;">This code will expire in 10 minutes.</p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding: 10px; background-color: #f9f9f9;">
              <p style="font-size: 12px; color: #888;">Powered by PollEi</p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
  };
  mail.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("error occured while sening mail : ", err);
    }
    if (data) {
      console.log("mail sent seccessfully");
    }
  });
}

module.exports = mailSender;
