import nodemailer from "nodemailer";

type MailData = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const smtpEmail = process.env.GMAIL_SMTP_EMAIL_ADDRESS;
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: smtpEmail,
    pass: process.env.GMAIL_SMTP_PASSWORD,
  },
});

const mailOptions = {
  from: `"Gaming Duniya 👻"${smtpEmail}`,
};

// async..await is not allowed in global scope, must use a wrapper
export const sendMail = async (options: MailData) => {
  // send mail with defined transport object
  if (options) {
    const info = await transporter.sendMail({
      ...mailOptions, // sender address
      to: options.to, // list of receivers
      subject: options.subject, // Subject line
      text: options.text, // plain text body
      html: options.html, // html body
    });

    console.log("Message sent: %s", info.messageId, info.response);
  }
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
};
