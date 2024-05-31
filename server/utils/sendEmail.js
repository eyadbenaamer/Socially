import { createTransport } from "nodemailer";

export const sendAccountVerificationCode = async (email, code, token) => {
  try {
    console.log(code);
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      subject: "Code verification",
      to: email,
      html: `
      <div>
        <div>code: ${code}</div>
        <div>or visit this link: <a>${process.env.APP_URL}/verify-account/${token}</a></div>
      </div>
      `,
    });
  } catch {}
};
export const sendResetPasswordCode = async (email, code, token) => {
  try {
    console.log(code);
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      subject: "Code verification",
      to: email,
      html: `
      <div>
        <div>code: ${code}</div>
        <div>or visit this link: <a href="${process.env.APP_URL}/verify-account/${token}">click here</a></div>
      </div>
      `,
    });
  } catch {}
};
