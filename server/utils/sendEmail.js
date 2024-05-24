import { createTransport } from "nodemailer";

export const sendCodeEmail = (email, code, token) => {
  try {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    transporter.sendMail({
      subject: "Code verification",
      to: email,
      html: `
      <div>
        <div>code: ${code}</div>
        <div>or visit this link: <a>${process.env.APP_URL}/verify-accuont?token=${token}</a></div>
      </div>
      `,
    });
  } catch {}
};
