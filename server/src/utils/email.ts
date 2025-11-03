import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function mailer(email: string, otp: number) {
  const html = `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`;
  return transporter.sendMail({
    from: `"no-reply" <${process.env.EMAIL}>`,
    to: email,
    subject: "OTP verification",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    html,
  });
}
