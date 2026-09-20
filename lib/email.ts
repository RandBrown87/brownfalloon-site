import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const reminderFrom = process.env.REMINDER_FROM_EMAIL || smtpUser;

export const isEmailConfigured = () =>
  Boolean(smtpHost && smtpUser && smtpPassword && reminderFrom);

export const sendReminderEmail = async (options: {
  to: string[];
  subject: string;
  text: string;
}) => {
  if (!smtpHost || !smtpUser || !smtpPassword || !reminderFrom) {
    throw new Error("SMTP email delivery is not configured.");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPassword },
  });

  await transporter.sendMail({
    from: reminderFrom,
    to: options.to.join(", "),
    subject: options.subject,
    text: options.text,
  });
};