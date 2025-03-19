import nodemailer from 'nodemailer';

// Define the mail options interface
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.mailersend.com",
  port: 587,
  secure: false,
  auth: {
    user: "focochat5@gmail.com",
    pass: "Redmond$222", // Consider using environment variables for sensitive data
  },
});

// Function to send mail
async function sendMailer(mailOptions: MailOptions): Promise<any> {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Error in nodemailer:', error);
    throw error;
  }
}

export default sendMailer;
