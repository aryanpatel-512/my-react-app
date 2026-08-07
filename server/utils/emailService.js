const nodemailer = require('nodemailer');
const logger = require('./logger');

const sendInquiryNotification = async (inquiryData) => {
  try {
    // If SMTP credentials aren't configured in .env, just log it and return so it doesn't crash
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.RECEIVER_EMAIL) {
      logger.warn("SMTP credentials not configured. Email notification skipped.");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail', // Defaulting to gmail, can be overridden by env variables
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Sri Srinivasa Clean Rooms" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Lead Alert: ${inquiryData.type === 'product' ? inquiryData.productName : 'General Inquiry'}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px;">
          <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">New Inquiry Received</h2>
          <p>You have received a new inquiry on your website. Here are the details:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 30%; background-color: #f9f9f9;">Name</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${inquiryData.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Phone</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${inquiryData.phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Email</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${inquiryData.email || 'Not Provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Type</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${inquiryData.type === 'product' ? 'Product Quote' : 'General Contact'}</td>
            </tr>
            ${inquiryData.type === 'product' ? `
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Product</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${inquiryData.productName}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Message</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${inquiryData.message}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-size: 0.9em; color: #666;">Log in to your Admin Dashboard to manage this lead.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Notification email sent for inquiry ${inquiryData._id}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Error sending email notification: ${error.message}`);
    // We do NOT throw the error here so that the original API request (saving to DB) still succeeds.
  }
};

module.exports = { sendInquiryNotification };
