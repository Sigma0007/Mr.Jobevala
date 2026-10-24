import nodemailer from "nodemailer";

/**
 * Creates and returns a Nodemailer transporter configured for:
 * 1. Custom SMTP Server (GoDaddy, Microsoft 365, Titan, etc.) via MAIL_HOST
 * 2. Service-based provider (e.g. Gmail) via EMAIL_SERVICE
 */
export const getTransporter = () => {
    const user = process.env.EMAIL_USER || process.env.MAIL_USER || process.env.GMAIL_USER;
    const pass = process.env.EMAIL_PASS || process.env.MAIL_PASS || process.env.GMAIL_APP_PASSWORD;
    const host = process.env.MAIL_HOST || process.env.EMAIL_HOST;

    if (!user || !pass) {
        return null;
    }

    // Custom SMTP Server (GoDaddy secureserver, Microsoft 365, Titan, etc.)
    if (host) {
        const port = Number(process.env.MAIL_PORT || process.env.EMAIL_PORT) || 587;
        const isSecure =
            process.env.MAIL_SECURE === "true" ||
            process.env.MAIL_SECURE === true ||
            port === 465;

        return nodemailer.createTransport({
            host,
            port,
            secure: isSecure, // true for 465, false for 587
            auth: {
                user,
                pass,
            },
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
        });
    }

    // Default to service-based provider (e.g. Gmail)
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || "gmail",
        auth: {
            user,
            pass,
        },
    });
};

/**
 * Sends an OTP email to the user for registration verification
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.otp - 6-digit verification code
 * @param {string} [options.name] - User name
 * @returns {Promise<{ success: boolean, messageId?: string, mocked?: boolean }>}
 */
export const sendOtpEmail = async ({ to, otp, name = "Valued Member" }) => {
    const transporter = getTransporter();
    const senderEmail = process.env.EMAIL_USER || process.env.GMAIL_USER || "no-reply@mrjobwala.com";
    const senderName = process.env.EMAIL_FROM_NAME || "Mr. Job Wala";
    const fromAddress = `"${senderName}" <${senderEmail}>`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification - Mr. Job Wala</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f1f5f9;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
        }
        .container {
          max-width: 580px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }
        .header {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          padding: 32px 24px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .header p {
          margin: 6px 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 36px 32px;
        }
        .greeting {
          font-size: 17px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 12px;
        }
        .text {
          font-size: 15px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 24px;
        }
        .otp-container {
          background-color: #f8fafc;
          border: 2px dashed #93c5fd;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          margin: 28px 0;
        }
        .otp-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #64748b;
          margin-bottom: 8px;
        }
        .otp-code {
          font-size: 38px;
          font-weight: 800;
          letter-spacing: 8px;
          color: #1d4ed8;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
          margin: 0;
          user-select: all;
        }
        .warning-card {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 13px;
          color: #92400e;
          margin-bottom: 24px;
        }
        .footer {
          background-color: #f8fafc;
          padding: 20px 32px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
        }
        .footer a {
          color: #2563eb;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Mr. Job Wala</h1>
          <p>Career Portal & Professional Network</p>
        </div>
        <div class="content">
          <div class="greeting">Hello, ${name}! 👋</div>
          <p class="text">
            Thank you for creating an account on <strong>Mr. Job Wala</strong>. To complete your registration and verify your email address, please use the 6-digit One-Time Password (OTP) below:
          </p>
          <div class="otp-container">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">${otp}</div>
          </div>
          <div class="warning-card">
            ⚠️ <strong>Security Notice:</strong> This code is valid for <strong>10 minutes</strong>. Do not share this OTP with anyone. Mr. Job Wala staff will never ask for your verification code.
          </div>
          <p class="text" style="font-size: 13px; color: #64748b; margin-bottom: 0;">
            If you did not initiate this sign-up request, please ignore this email or reach out to our support team.
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 6px;">&copy; ${new Date().getFullYear()} Mr. Job Wala. All rights reserved.</p>
          <p style="margin: 0;">Connecting Top Talent with Great Opportunities</p>
        </div>
      </div>
    </body>
    </html>
  `;

    // If transporter is not configured (e.g. EMAIL_USER/PASS not set yet in .env)
    if (!transporter) {
        console.log("\n=======================================================");
        console.log("📧 [DEVELOPMENT NOTICE - EMAIL CREDENTIALS NOT CONFIGURED]");
        console.log(`To: ${to}`);
        console.log(`Generated OTP: ${otp}`);
        console.log("Add MAIL_HOST, EMAIL_USER, and EMAIL_PASS to backend/.env to send live emails.");
        console.log("=======================================================\n");

        return {
            success: true,
            mocked: true,
            message: "Credentials not configured in .env. OTP displayed in backend console.",
        };
    }

    try {
        const info = await transporter.sendMail({
            from: fromAddress,
            to,
            subject: `${otp} is your Mr. Job Wala verification code`,
            text: `Hello ${name},\n\nYour Mr. Job Wala registration verification code is: ${otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.\n\nThank you,\nMr. Job Wala Team`,
            html: htmlContent,
        });

        console.log(`[EMAIL SENT] OTP successfully sent to ${to}. MessageId: ${info.messageId}`);
        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error("[EMAIL SEND ERROR]", error);

        // Fallback log so registration test is not blocked if credentials failed
        console.log("\n=======================================================");
        console.log("📧 [FALLBACK DEV OTP LOG (Email delivery failed)]");
        console.log(`Recipient: ${to}`);
        console.log(`OTP Code: ${otp}`);
        console.log(`Error: ${error.message}`);
        console.log("=======================================================\n");

        throw new Error(
            `Failed to send verification email: ${error.message}. Please check your SMTP settings in backend/.env.`
        );
    }
};
