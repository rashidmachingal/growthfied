const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Correct hostname for Gmail
    port: 465, // Use 465 for secure connection (SSL/TLS)
    secure: true, // True for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS 
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: text,
  };
  
  const {error, info} = await transporter.sendMail(mailOptions);
  
}

module.exports = { sendEmail }