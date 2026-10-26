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

/**
 * Sends a Subscription Confirmation & Tax Invoice Receipt Email with PDF attachment
 * @param {Object} options
 * @param {string} options.to - Recipient customer email
 * @param {string} [options.name] - Customer name
 * @param {string} options.planName - Name of subscription or add-on
 * @param {number} options.amount - Total amount paid
 * @param {string} options.invoiceNumber - Unique tax invoice number
 * @param {string} options.paymentId - Razorpay Payment ID
 * @param {string} options.orderId - Razorpay Order ID
 * @param {Date|string} [options.startDate] - Subscription start date
 * @param {Date|string} [options.endDate] - Subscription end date
 * @param {string} [options.invoiceUrl] - Cloudflare R2 / stream invoice URL
 * @param {Buffer} [options.pdfBuffer] - The invoice PDF binary buffer
 * @param {boolean} [options.isExtraPost] - Whether this was an extra post purchase
 * @param {number} [options.quantity] - Number of extra posts or items
 * @returns {Promise<{ success: boolean, messageId?: string, mocked?: boolean }>}
 */
export const sendSubscriptionInvoiceEmail = async ({
  to,
  name = "Valued Member",
  planName = "Job Portal Subscription",
  amount,
  invoiceNumber,
  paymentId,
  orderId,
  startDate,
  endDate,
  invoiceUrl,
  pdfBuffer = null,
  isExtraPost = false,
  quantity = 1,
}) => {
  console.log("invoiceUrl++++++++++++++++", invoiceUrl);
  const transporter = getTransporter();
  const senderEmail = process.env.EMAIL_USER || process.env.GMAIL_USER || "billing@jobwala.com";
  const senderName = process.env.COMPANY_NAME || process.env.EMAIL_FROM_NAME || "Mr. Job Wala";
  const companyLogo =
    process.env.COMPANY_LOGO_PATH ||
    "https://job-portal-f-az3p.onrender.com/Image/logo.png";
  const companyEmail = process.env.COMPANY_EMAIL || senderEmail;
  const fromAddress = `"${senderName}" <${senderEmail}>`;

  const formattedStartDate = startDate
    ? new Date(startDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : "Immediate";

  const formattedEndDate = endDate
    ? new Date(endDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : "N/A";

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Receipt & Invoice - ${invoiceNumber}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f1f5f9;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
        }
        .container {
          max-width: 600px;
          margin: 32px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }
        .header {
          background: linear-gradient(135deg, #0d9488, #0f766e);
          padding: 32px 24px;
          text-align: center;
          color: #ffffff;
        }
        .logo {
          max-height: 48px;
          margin-bottom: 12px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .header p {
          margin: 6px 0 0;
          font-size: 14px;
          opacity: 0.92;
        }
        .content {
          padding: 32px 28px;
        }
        .greeting {
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 10px;
        }
        .text {
          font-size: 14px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 20px;
        }
        .receipt-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .card-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
          font-size: 13px;
        }
        .card-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .card-label {
          color: #64748b;
          font-weight: 500;
        }
        .card-val {
          color: #0f172a;
          font-weight: 700;
          text-align: right;
        }
        .total-row {
          background: #f0fdfa;
          margin: 12px -20px -20px -20px;
          padding: 14px 20px;
          border-radius: 0 0 12px 12px;
          border-top: 2px solid #0d9488;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .total-label {
          font-size: 14px;
          font-weight: 700;
          color: #0f766e;
        }
        .total-amount {
          font-size: 20px;
          font-weight: 800;
          color: #0f766e;
        }
        .btn-container {
          text-align: center;
          margin: 28px 0;
        }
        .btn {
          display: inline-block;
          background: #0d9488;
          color: #ffffff !important;
          font-weight: 700;
          font-size: 14px;
          padding: 12px 28px;
          border-radius: 8px;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(13, 148, 136, 0.35);
        }
        .attachment-note {
          background-color: #f0fdf4;
          border-left: 4px solid #16a34a;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 12.5px;
          color: #166534;
          margin-bottom: 24px;
        }
        .footer {
          background-color: #f8fafc;
          padding: 20px 28px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${companyLogo ? `<img src="${companyLogo}" alt="${senderName}" class="logo" />` : ""}
          <h1>Payment Receipt & Confirmation</h1>
          <p>Thank you for subscribing to ${senderName}</p>
        </div>
        <div class="content">
          <div class="greeting">Hello, ${name}! 👋</div>
          <p class="text">
            We are pleased to inform you that your payment has been successfully processed and verified.
            ${isExtraPost
      ? `Your account has been credited with <strong>+${quantity} extra post${quantity > 1 ? "s" : ""}</strong>.`
      : `Your subscription to the <strong>${planName}</strong> plan is now active.`
    }
          </p>

          <div class="receipt-card">
            <div class="card-row">
              <span class="card-label">Invoice Number</span>
              <span class="card-val" style="font-family: monospace;">${invoiceNumber}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Item / Plan</span>
              <span class="card-val">${planName}</span>
            </div>
            ${!isExtraPost && startDate && endDate
      ? `<div class="card-row">
                        <span class="card-label">Subscription Validity</span>
                        <span class="card-val">${formattedStartDate} &ndash; ${formattedEndDate}</span>
                      </div>`
      : ""
    }
            <div class="card-row">
              <span class="card-label">Payment ID</span>
              <span class="card-val" style="font-family: monospace;">${paymentId}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Order ID</span>
              <span class="card-val" style="font-family: monospace;">${orderId}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Payment Status</span>
              <span class="card-val" style="color: #16a34a;">Paid & Confirmed</span>
            </div>
            <div class="total-row">
              <span class="total-label">Total Amount Paid</span>
              <span class="total-amount">₹${Number(amount).toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div class="attachment-note">
            📄 <strong>Tax Invoice Attached:</strong> A formal PDF receipt (<strong>${invoiceNumber}.pdf</strong>) has been generated and attached to this email for your accounting and taxation records.
          </div>

          ${invoiceUrl
      ? `<div class="btn-container">
                      <a href="${process.env.FRONTEND_URL + invoiceUrl}" target="_blank" class="btn">View & Download Invoice PDF</a>
                    </div>`
      : ""
    }

          <p class="text" style="font-size: 12.5px; color: #64748b; margin-bottom: 0;">
            If you have any questions or require custom billing information, please reply to this email or reach us at <a href="mailto:${companyEmail}" style="color: #0d9488;">${companyEmail}</a>.
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 4px;">&copy; ${new Date().getFullYear()} ${senderName}. All rights reserved.</p>
          <p style="margin: 0;">This is an automated transaction confirmation.</p>
        </div>
      </div>
    </body>
    </html>
    `;

  if (!transporter) {
    console.log("\n=======================================================");
    console.log("📧 [DEVELOPMENT NOTICE - INVOICE EMAIL]");
    console.log(`To: ${to}`);
    console.log(`Invoice: ${invoiceNumber} | Plan: ${planName} | Amount: ₹${amount}`);
    console.log(`Invoice URL: ${invoiceUrl || "N/A"}`);
    console.log("PDF Buffer Attached:", Boolean(pdfBuffer));
    console.log("=======================================================\n");

    return {
      success: true,
      mocked: true,
      message: "Email credentials not configured in .env. Logged to console.",
    };
  }

  try {
    const mailOptions = {
      from: fromAddress,
      to,
      subject: `Payment Receipt & Tax Invoice #${invoiceNumber} - ${senderName}`,
      text: `Hello ${name},\n\nYour payment of ₹${amount} for ${planName} was successful.\nInvoice Number: ${invoiceNumber}\nPayment ID: ${paymentId}\nOrder ID: ${orderId}\n\nYour tax invoice PDF is attached.\n\nThank you,\n${senderName}`,
      html: htmlContent,
      attachments: [],
    };

    // Attach PDF buffer if within safe email limits (max 8MB)
    if (pdfBuffer) {
      const bufferSize = Buffer.isBuffer(pdfBuffer) ? pdfBuffer.length : 0;
      if (bufferSize > 0 && bufferSize <= 8 * 1024 * 1024) {
        mailOptions.attachments.push({
          filename: `${invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        });
      } else if (bufferSize > 8 * 1024 * 1024) {
        console.warn(
          `[INVOICE EMAIL WARNING] PDF size (${(bufferSize / 1024 / 1024).toFixed(2)} MB) exceeds safe SMTP attachment threshold (8 MB). Sending with direct Cloudflare R2 download link instead.`
        );
      }
    }

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[INVOICE EMAIL SENT] Sent to ${to}. MessageId: ${info.messageId}`);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (sendErr) {
      // If the error was due to SMTP size rejection (e.g. 552 DATA size exceeds maximum permitted), retry without attachment
      const isSizeError =
        sendErr.responseCode === 552 ||
        (sendErr.message && /552|size exceeds|maximum permitted/i.test(sendErr.message));

      if (isSizeError && mailOptions.attachments.length > 0) {
        console.warn(
          `[INVOICE EMAIL RETRY] SMTP 552 size limit encountered. Retrying email to ${to} without attachment...`
        );
        mailOptions.attachments = [];
        const retryInfo = await transporter.sendMail(mailOptions);
        console.log(
          `[INVOICE EMAIL SENT - NO ATTACHMENT] Sent to ${to}. MessageId: ${retryInfo.messageId}`
        );
        return {
          success: true,
          messageId: retryInfo.messageId,
          fallbackWithoutAttachment: true,
        };
      }
      throw sendErr;
    }
  } catch (error) {
    console.error("[INVOICE EMAIL SEND ERROR]", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

