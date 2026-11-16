import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { logger } from './logger.js';

let transporter = null;

if (config.smtp.host && config.smtp.user) {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass
    }
  });
}

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    logger.info(`[Email Service - Dev Mode] Simulated email to: ${to}`);
    logger.info(`[Email Service - Dev Mode] Subject: ${subject}`);
    logger.debug(`[Email Service - Dev Mode] Body:\n${text || html}`);
    return { messageId: 'simulated-dev-id' };
  }

  try {
    const info = await transporter.sendMail({
      from: config.smtp.from,
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ''),
      html
    });
    logger.info(`[Email Service] Email sent: ${info.messageId} to ${to}`);
    return info;
  } catch (error) {
    logger.error(`[Email Service Error] Failed to send email to ${to}: ${error.message}`);
    // Non-blocking in dev/test
    if (config.env === 'production') {
      throw error;
    }
  }
};

export const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0B132B; margin: 0; font-size: 24px;">Futuristic Thinkers</h1>
        <p style="color: #06D6A0; font-weight: 600; margin-top: 4px;">Inspiring Tomorrow's Innovators</p>
      </div>
      <p style="color: #334155; font-size: 16px;">Hello <strong>${user.name}</strong>,</p>
      <p style="color: #334155; font-size: 15px; line-height: 1.6;">
        Welcome to Futuristic Thinkers! We are thrilled to partner with you on your child's journey into the fascinating world of technology and Artificial Intelligence.
      </p>
      <div style="background-color: #F8FAFC; border-left: 4px solid #14B8A6; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #0F172A; font-size: 16px;">Next Steps:</h3>
        <ul style="color: #475569; font-size: 14px; margin-bottom: 0; padding-left: 20px;">
          <li>Create a child profile (nickname and avatar only &mdash; safe &amp; COPPA compliant).</li>
          <li>Explore our flagship course: <strong>AI Explorers Academy (Ages 7-10)</strong>.</li>
          <li>Join characters Zara, Zahran, and Luna on 10 story-driven adventures!</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${config.clientUrl}/dashboard" style="background-color: #0B132B; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Go to Parent Dashboard
        </a>
      </div>
      <p style="color: #64748B; font-size: 13px; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 16px;">
        If you have any questions, simply reply to this email or contact support at support@futuristicthinkers.com.
      </p>
    </div>
  `;

  return await sendEmail({
    to: user.email,
    subject: "Welcome to Futuristic Thinkers! Inspiring Tomorrow's Innovators",
    html
  });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0B132B; margin: 0; font-size: 24px;">Futuristic Thinkers</h1>
        <p style="color: #06D6A0; font-weight: 600; margin-top: 4px;">Password Reset Request</p>
      </div>
      <p style="color: #334155; font-size: 16px;">Hello <strong>${user.name}</strong>,</p>
      <p style="color: #334155; font-size: 15px; line-height: 1.6;">
        You recently requested to reset your password for your Futuristic Thinkers parent account. Click the button below to reset it. This link is valid for 1 hour.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #F59E0B; color: #0B132B; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Reset Your Password
        </a>
      </div>
      <p style="color: #64748B; font-size: 13px; line-height: 1.5;">
        Or paste this link into your browser:<br />
        <a href="${resetUrl}" style="color: #0D9488; word-break: break-all;">${resetUrl}</a>
      </p>
      <p style="color: #94A3B8; font-size: 12px; border-top: 1px solid #E2E8F0; padding-top: 16px;">
        If you did not request a password reset, please ignore this email or contact support if you suspect unauthorized access.
      </p>
    </div>
  `;

  return await sendEmail({
    to: user.email,
    subject: 'Password Reset Request - Futuristic Thinkers',
    html
  });
};

