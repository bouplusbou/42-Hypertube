const nodemailer = require("nodemailer");

const sendEmail = async (email, emailHash) => {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = await nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    sendmail: true,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    }
  });

  transporter.sendMail({
    from: '"Hypertube Team" <hello@hypertube.com>',
    to: email, 
    subject: 'Hypertube - Password reset request',
    text: `Please follow this link to reset your password: http://localhost:3000/resetPassword/${emailHash}`,
  });
}

module.exports = sendEmail;
