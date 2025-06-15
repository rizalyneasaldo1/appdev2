const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');

require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendBookCreatedEmail(bookDetails) {
  const html = pug.renderFile(
    path.join(__dirname, '../views/bookCreated.pug'),
    {
      title: bookDetails.title,
      author: bookDetails.author,
      year: bookDetails.year
    }
  );

  const mailOptions = {
    from: `"Book API" <${process.env.SMTP_USER}>`,
    to: process.env.DEFAULT_RECIPIENT,
    subject: 'Newly Added Book',
    html
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendBookCreatedEmail;
