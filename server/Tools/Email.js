const nodemailer = require("nodemailer");

const sendEmail = async (isOAuth, email, emailHash) => {
  try {
    let type = isOAuth ? 'isOAuth' : 'isNotOAuth';
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
    const subject = {
      'isOAuth': 'Hypertube - You cannot change your password',
      'isNotOAuth': 'Hypertube - Password reset request',
    };
    const message = {
      'isOAuth': `Sorry but you cannot change your password since you logged in with another OAuth provider (your 42 or Google account).`,
      'isNotOAuth': `Please follow this link to reset your password: http://localhost:3000/resetPassword/${emailHash}`,
    };
    await transporter.sendMail({
      from: '"Hypertube Team" <hello@hypertube.com>',
      to: email, 
      subject: subject[type],
      text: message[type],
    });
  } catch(err) { console.log(err); }
}

module.exports = sendEmail;
