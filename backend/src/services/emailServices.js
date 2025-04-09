import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const CLIENT_ID = process.env.GMAIL_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || "";
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN || "";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (to, subject, text, replyTo) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "natnaree@divafactorynails.com", // your Gmail
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token || "",
      },
    });

    const info = await transporter.sendMail({
      from: `"Diva Nails" <support@divafactorynails.com>`,
      to,
      subject,
      text,
      replyTo,
    });

    console.log("✅ Gmail Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Gmail OAuth2 Email Error:", error);
    throw error;
  }
};

export default sendEmail;