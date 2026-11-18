const nodemailer = require('nodemailer');
const logger = require('./logger');

const getTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendInquiryNotification = async (inquiryData) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.RECEIVER_EMAIL) {
    logger.warn("SMTP credentials not configured. Email notification skipped.");
    return;
  }

  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"Sri Srinivasa Clean Rooms" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `🔔 New Lead: ${inquiryData.type === 'product' ? inquiryData.productName : 'General Inquiry'}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">🔔 New Inquiry Received</h2>
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
    logger.info(`Email notification sent for inquiry ${inquiryData._id}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email notification failed: ${error.message}`);
  }
};

const sendWebsiteEnquiry = async ({ name, email, phone, subject, message }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.RECEIVER_EMAIL) {
    logger.warn("SMTP credentials not configured. Website enquiry email skipped.");
    throw new Error("Email service is temporarily unavailable.");
  }

  const transporter = getTransporter();

  const mailOptions = {
    from: `"Sri Srinivasa Clean Rooms Website" <${process.env.SMTP_USER}>`,
    to: process.env.RECEIVER_EMAIL,
    replyTo: email,
    subject: `New Website Enquiry: ${subject}`,
    text: `New Website Enquiry\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nSubject: ${subject}\n\nMessage:\n${message}\n\nSource: Sri Srinivasa Clean Rooms Website`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <h2 style="color: #0d9488; margin-top: 0; padding-bottom: 12px; border-bottom: 2px solid #0d9488;">New Website Enquiry</h2>
        <p style="color: #475569; font-size: 14px; margin-bottom: 20px;">A visitor has submitted a message via the Founder &amp; Managing Director contact card on the website.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 28%; background-color: #f8fafc; color: #334155;">Name</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; color: #1e293b;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc; color: #334155;">Email</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; color: #1e293b;"><a href="mailto:${email}" style="color: #0d9488; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc; color: #334155;">Phone</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; color: #1e293b;">${phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc; color: #334155;">Subject</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; color: #1e293b; font-weight: 600;">${subject}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-left: 4px solid #0d9488; border-radius: 4px;">
          <strong style="color: #334155; display: block; margin-bottom: 8px;">Message:</strong>
          <p style="color: #1e293b; margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        <p style="margin-top: 25px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          Source: Sri Srinivasa Clean Rooms Website &bull; Click Reply to respond directly to ${email}
        </p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  logger.info(`Website enquiry email sent: ${info.messageId} (Reply-To: ${email})`);
  return info;
};

const sendAdminReplyToCustomer = async ({ to, subject, message }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn("SMTP credentials not configured. Cannot send email to customer.");
    throw new Error("SMTP credentials are not configured on the server.");
  }

  const transporter = getTransporter();

  const mailOptions = {
    from: `"Sri Srinivasa Clean Rooms" <${process.env.SMTP_USER}>`,
    to,
    replyTo: process.env.RECEIVER_EMAIL || process.env.SMTP_USER,
    subject,
    text: message,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="border-bottom: 2px solid #0d9488; padding-bottom: 14px; margin-bottom: 20px;">
          <h2 style="color: #0d9488; margin: 0; font-size: 20px; font-weight: 700;">Sri Srinivasa Clean Rooms</h2>
          <p style="color: #64748b; margin: 4px 0 0; font-size: 13px;">Specialists in Modular Cleanrooms, Hospital Furniture &amp; OT Infrastructure</p>
        </div>
        <div style="color: #1e293b; font-size: 15px; line-height: 1.65; white-space: pre-wrap; margin-bottom: 25px;">
${message}
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #64748b; line-height: 1.5;">
          <p style="margin: 0; font-weight: 700; color: #334155;">Sri Srinivasa Clean Rooms</p>
          <p style="margin: 3px 0;">Subhash Nagar, Malkajgiri, Hyderabad, Telangana – 500055</p>
          <p style="margin: 3px 0;">Phone: +91 94406 43193 | Website: <a href="https://srisrinivasacleanrooms.com" style="color: #0d9488;">srisrinivasacleanrooms.com</a></p>
        </div>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  logger.info(`Admin email dispatched to ${to}: ${info.messageId}`);
  return info;
};

module.exports = {
  sendInquiryNotification,
  sendWebsiteEnquiry,
  sendAdminReplyToCustomer
};
