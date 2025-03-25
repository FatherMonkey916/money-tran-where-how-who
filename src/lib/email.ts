require('dotenv').config();
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
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "focochat5@gmail.com",
    pass: "ummc vvjj lmhd pcfe", // Consider using environment variables for sensitive data
  },
  tls: {
    ciphers:'SSLv3'
  },
});

// Function to send mail
async function sendMailer(mailOptions: MailOptions): Promise<any> {
  return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
              console.error("Error in nodemailer:",err);
              reject(err)
          }
          resolve(info)
      })
  })
}


export default sendMailer;
