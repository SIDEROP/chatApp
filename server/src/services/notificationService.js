import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email notification
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email content
 */
const sendEmailNotification = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

export default {
  sendEmailNotification,
};
