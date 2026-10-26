import puppeteer from "puppeteer";
import mongoose from "mongoose";
import { uploadToR2 } from "./r2Storage.js";

/**
 * Get company details from environment variables with graceful fallbacks
 */
export const getCompanyDetails = () => {
    return {
        name: process.env.COMPANY_NAME || "Mr. Job Wala",
        gstin: process.env.COMPANY_GSTIN || "GST123458791MRR",
        address: process.env.COMPANY_ADDRESS || "Rajkot, Gujarat, India.",
        email: process.env.COMPANY_EMAIL || "billing@jobwala.com",
        logo:
            process.env.COMPANY_LOGO_PATH ||
            "https://job-portal-f-az3p.onrender.com/Image/logo.png",
        sacCode: "998311", // SAC for Employment Placement and Recruiting Services
        placeOfSupply: "Gujarat (24)",
    };
};

/**
 * Convert numerical INR amount to Indian Currency Words
 * Example: 499 -> "Four Hundred Ninety-Nine Rupees Only"
 */
export const numberToWordsINR = (num) => {
    if (!num || isNaN(num)) return "Zero Rupees Only";
    const a = [
        "",
        "One ",
        "Two ",
        "Three ",
        "Four ",
        "Five ",
        "Six ",
        "Seven ",
        "Eight ",
        "Nine ",
        "Ten ",
        "Eleven ",
        "Twelve ",
        "Thirteen ",
        "Fourteen ",
        "Fifteen ",
        "Sixteen ",
        "Seventeen ",
        "Eighteen ",
        "Nineteen ",
    ];
    const b = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
    ];

    const format999 = (n) => {
        let str = "";
        if (n > 99) {
            str += a[Math.floor(n / 100)] + "Hundred ";
            n %= 100;
        }
        if (n > 19) {
            str += b[Math.floor(n / 10)] + " " + a[n % 10];
        } else {
            str += a[n];
        }
        return str;
    };

    const integerPart = Math.floor(num);
    const paisePart = Math.round((num - integerPart) * 100);

    if (integerPart === 0 && paisePart === 0) return "Zero Rupees Only";

    let result = "";
    const crores = Math.floor(integerPart / 10000000);
    const lakhs = Math.floor((integerPart % 10000000) / 100000);
    const thousands = Math.floor((integerPart % 100000) / 1000);
    const remaining = integerPart % 1000;

    if (crores > 0) result += format999(crores) + "Crore ";
    if (lakhs > 0) result += format999(lakhs) + "Lakh ";
    if (thousands > 0) result += format999(thousands) + "Thousand ";
    if (remaining > 0) result += format999(remaining);

    result = result.trim() + " Rupees";
    if (paisePart > 0) {
        result += " and " + format999(paisePart).trim() + " Paise";
    }
    return result + " Only";
};

/**
 * Calculate Indian GST breakdown (18% inclusive standard)
 */
export const calculateTaxDetails = (amount, customerState = "Gujarat") => {
    const total = Number(amount) || 0;
    const taxRate = 18; // 18% standard GST for online services
    // Subtotal = Total / 1.18
    const subtotal = Math.round((total / (1 + taxRate / 100)) * 100) / 100;
    const taxAmount = Math.round((total - subtotal) * 100) / 100;

    const isGujarat =
        !customerState ||
        customerState.toLowerCase().includes("gujarat") ||
        customerState.toLowerCase().includes("gj");

    const isInterState = !isGujarat;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isInterState) {
        igst = taxAmount;
    } else {
        cgst = Math.round((taxAmount / 2) * 100) / 100;
        sgst = Math.round((taxAmount - cgst) * 100) / 100;
    }

    return {
        subtotal,
        taxRate,
        cgst,
        sgst,
        igst,
        taxAmount,
        total,
        isInterState,
    };
};

/**
 * Generate a unique, standard GST tax invoice number
 * Format: INV-YYYYMM-XXXXXX
 */
export const generateInvoiceNumber = (orderId, date = new Date()) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const suffix = (orderId || Date.now().toString()).slice(-6).toUpperCase();
    return `INV-${year}${month}-${suffix}`;
};

/**
 * Resolve full customer name, contact and billing address from Payment, UserProfile, or CompanyProfile
 */
export const resolveCustomerDetails = async (payment, userDoc = null) => {
    let name = payment?.customerDetails?.name || userDoc?.name || "";
    let email = payment?.customerDetails?.email || userDoc?.email || "";
    let phone = payment?.customerDetails?.phone || userDoc?.phone || "";
    let address = payment?.customerDetails?.address || "";
    let city = payment?.customerDetails?.city || "";
    let state = payment?.customerDetails?.state || "";
    let country = payment?.customerDetails?.country || "India";
    let pincode = payment?.customerDetails?.pincode || "";
    let gstin = payment?.customerDetails?.gstin || "";

    const userId = payment?.user || userDoc?._id;
    if (userId) {
        // 1. Try UserProfile for candidate or individual user address
        if (!address || !city || !state) {
            try {
                const UserProfile = mongoose.model("UserProfile");
                const profile = await UserProfile.findOne({ user: userId });
                if (profile) {
                    name = name || profile.name || name;
                    phone = phone || profile.phone || phone;
                    if (profile.location) {
                        address =
                            address ||
                            profile.location.address ||
                            profile.location.talukaOrVillage ||
                            "";
                        city = city || profile.location.city || "";
                        state = state || profile.location.state || "";
                        country = country || profile.location.country || "India";
                    }
                }
            } catch (_) {}
        }

        // 2. Try CompanyProfile for employer or provider company address
        if (!address || !city || !gstin) {
            try {
                const CompanyProfile = mongoose.model("CompanyProfile");
                const comp = await CompanyProfile.findOne({ user: userId });
                if (comp) {
                    name = name || comp.companyName || comp.name || name;
                    phone = phone || comp.phone || comp.ownerPhone || phone;
                    email = email || comp.ownerEmail || email;
                    address = address || comp.location || "";
                }
            } catch (_) {}
        }
    }

    return {
        name: name || "Valued Customer",
        email: email || "customer@mrjobwala.com",
        phone: phone || "N/A",
        address: address || "Registered Member Address",
        city: city || "Rajkot",
        state: state || "Gujarat",
        country: country || "India",
        pincode: pincode || "",
        gstin: gstin || "Unregistered / Consumer",
    };
};

/**
 * Generate complete standalone HTML document for the Tax Invoice PDF
 */
export const generateInvoiceHtml = ({
    company,
    customer,
    payment,
    subscription,
    invoiceNumber,
    taxDetails,
    invoiceDate = new Date(),
}) => {
    const formattedDate = new Date(invoiceDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const formattedPaymentDate = new Date(
        payment?.createdAt || invoiceDate
    ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const isExtraPost =
        payment?.planId === "extra_job_post" ||
        payment?.planId === "extra_company_post" ||
        payment?.notes?.type === "extra_post";

    const itemName = isExtraPost
        ? payment?.purpose || "Extra Post Quota Add-on"
        : subscription?.planDetails?.name || payment?.purpose || "Job Portal Subscription Plan";

    const itemCategory = subscription?.planDetails?.category || (isExtraPost ? "Add-on Quota" : "Subscription");
    const itemValidity = subscription?.planDetails?.validityDays
        ? `${subscription.planDetails.validityDays} Days`
        : isExtraPost
        ? "Active Subscription Validity"
        : "30 Days";

    const quantity = isExtraPost
        ? Number(payment?.notes?.quantity) || 1
        : 1;

    const amountInWords = numberToWordsINR(taxDetails.total);

    const fullCustomerAddress = [
        customer.address,
        customer.city,
        customer.state ? `${customer.state}${customer.pincode ? ` - ${customer.pincode}` : ""}` : "",
        customer.country,
    ]
        .filter(Boolean)
        .join(", ");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${invoiceNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      font-size: 11.5px;
      line-height: 1.45;
      -webkit-font-smoothing: antialiased;
    }

    .invoice-wrapper {
      max-width: 100%;
      margin: 0 auto;
      padding: 12px;
    }

    /* Header */
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 2px solid #e2e8f0;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-img {
      max-height: 48px;
      max-width: 160px;
      object-fit: contain;
    }

    .company-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.4px;
      margin-bottom: 2px;
    }

    .company-meta {
      font-size: 10.5px;
      color: #475569;
      line-height: 1.35;
    }

    .invoice-heading-box {
      text-align: right;
    }

    .invoice-tag {
      display: inline-block;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #0d9488;
      background: #ccfbf1;
      padding: 3px 8px;
      border-radius: 4px;
      margin-bottom: 4px;
    }

    .invoice-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin: 0 0 2px 0;
    }

    .invoice-number {
      font-family: 'Courier New', Courier, monospace;
      font-size: 13px;
      font-weight: 700;
      color: #0d9488;
    }

    /* Meta bar */
    .meta-bar {
      width: 100%;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .meta-item {
      display: inline-block;
      margin-right: 20px;
      vertical-align: top;
    }

    .meta-label {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }

    .meta-val {
      font-size: 11px;
      font-weight: 600;
      color: #0f172a;
    }

    .paid-stamp {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #ecfdf5;
      border: 1.5px solid #059669;
      color: #047857;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    /* Addresses Grid */
    .address-grid {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
    }

    .address-grid td {
      width: 50%;
      vertical-align: top;
      padding: 0;
    }

    .address-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      min-height: 115px;
      background-color: #ffffff;
    }

    .address-card.left {
      margin-right: 8px;
    }

    .address-card.right {
      margin-left: 8px;
    }

    .address-card-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #64748b;
      margin-bottom: 6px;
      padding-bottom: 4px;
      border-bottom: 1px solid #f1f5f9;
    }

    .client-name {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
    }

    .address-line {
      font-size: 11px;
      color: #334155;
      line-height: 1.4;
      margin-bottom: 2px;
    }

    /* Items Table */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }

    .items-table th {
      background-color: #0f172a;
      color: #ffffff;
      padding: 9px 12px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      text-align: left;
    }

    .items-table th.right, .items-table td.right {
      text-align: right;
    }

    .items-table th.center, .items-table td.center {
      text-align: center;
    }

    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
      vertical-align: top;
    }

    .item-title {
      font-weight: 700;
      font-size: 12px;
      color: #0f172a;
      margin-bottom: 2px;
    }

    .item-subtitle {
      font-size: 10px;
      color: #64748b;
    }

    /* Summary & Totals */
    .summary-grid {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
    }

    .summary-grid td {
      vertical-align: top;
    }

    .payment-details-box {
      width: 54%;
      padding-right: 16px;
    }

    .totals-box {
      width: 46%;
    }

    .info-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 10px;
    }

    .info-card-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #475569;
      margin-bottom: 6px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 10.5px;
      margin-bottom: 3px;
      color: #334155;
    }

    .totals-table {
      width: 100%;
      border-collapse: collapse;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }

    .totals-table td {
      padding: 7px 12px;
      font-size: 11px;
      border-bottom: 1px solid #f1f5f9;
    }

    .totals-table td.label {
      color: #475569;
      font-weight: 500;
    }

    .totals-table td.val {
      text-align: right;
      color: #0f172a;
      font-weight: 600;
    }

    .totals-table tr.grand-total {
      background-color: #f0fdfa;
      border-top: 2px solid #0d9488;
    }

    .totals-table tr.grand-total td {
      padding: 10px 12px;
      font-size: 14px;
      font-weight: 800;
      color: #0f766e;
    }

    .words-box {
      font-size: 10.5px;
      color: #475569;
      margin-top: 8px;
      padding: 8px 10px;
      background: #f8fafc;
      border-left: 3px solid #0d9488;
      border-radius: 0 4px 4px 0;
    }

    /* Footer & Declarations */
    .footer-section {
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid #e2e8f0;
    }

    .footer-table {
      width: 100%;
      border-collapse: collapse;
    }

    .footer-table td {
      vertical-align: top;
    }

    .legal-text {
      font-size: 9.5px;
      color: #64748b;
      line-height: 1.45;
      padding-right: 20px;
    }

    .signatory-box {
      text-align: right;
      width: 200px;
    }

    .signatory-title {
      font-size: 10px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 28px;
    }

    .signatory-name {
      font-size: 11px;
      font-weight: 700;
      color: #0f766e;
      border-top: 1px dashed #94a3b8;
      padding-top: 4px;
      display: inline-block;
    }

    .help-banner {
      margin-top: 14px;
      background: #f1f5f9;
      border-radius: 6px;
      padding: 6px 12px;
      text-align: center;
      font-size: 9.5px;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <!-- Top Header -->
    <table class="header-table">
      <tr>
        <td style="width: 55%; vertical-align: middle;">
          <div class="logo-container">
            ${
                company.logo
                    ? `<img src="${company.logo}" alt="${company.name}" class="logo-img" />`
                    : ""
            }
            <div>
              <div class="company-title">${company.name}</div>
              <div class="company-meta">
                <strong>GSTIN:</strong> ${company.gstin}<br />
                ${company.address}<br />
                <strong>Email:</strong> ${company.email}
              </div>
            </div>
          </div>
        </td>
        <td style="width: 45%; vertical-align: middle;">
          <div class="invoice-heading-box">
            <span class="invoice-tag">Official Tax Invoice</span>
            <div class="invoice-title">PAYMENT RECEIPT</div>
            <div class="invoice-number">${invoiceNumber}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">
              Original for Recipient (B2C/B2B)
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Key Metadata Bar -->
    <div class="meta-bar">
      <div>
        <div class="meta-item">
          <div class="meta-label">Invoice Date</div>
          <div class="meta-val">${formattedDate}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Payment ID</div>
          <div class="meta-val" style="font-family: monospace;">${payment?.paymentId || "pay_verified"}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Order ID</div>
          <div class="meta-val" style="font-family: monospace;">${payment?.orderId || "N/A"}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Place of Supply</div>
          <div class="meta-val">${customer.state ? `${customer.state}` : company.placeOfSupply}</div>
        </div>
      </div>
      <div>
        <div class="paid-stamp">
          ✓ PAID & VERIFIED
        </div>
      </div>
    </div>

    <!-- Billed By & Billed To Cards -->
    <table class="address-grid">
      <tr>
        <td>
          <div class="address-card left">
            <div class="address-card-title">Billed By (Supplier)</div>
            <div class="client-name">${company.name}</div>
            <div class="address-line">${company.address}</div>
            <div class="address-line"><strong>GSTIN:</strong> ${company.gstin}</div>
            <div class="address-line"><strong>Email:</strong> ${company.email}</div>
          </div>
        </td>
        <td>
          <div class="address-card right">
            <div class="address-card-title">Billed To (Customer / Client)</div>
            <div class="client-name">${customer.name}</div>
            <div class="address-line">${fullCustomerAddress}</div>
            <div class="address-line"><strong>Email:</strong> ${customer.email}</div>
            ${customer.phone ? `<div class="address-line"><strong>Phone:</strong> ${customer.phone}</div>` : ""}
            <div class="address-line"><strong>Customer GSTIN:</strong> ${customer.gstin}</div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 5%;">#</th>
          <th style="width: 45%;">Service / Plan Description</th>
          <th class="center" style="width: 12%;">SAC Code</th>
          <th class="center" style="width: 8%;">Qty</th>
          <th class="right" style="width: 15%;">Taxable (₹)</th>
          <th class="right" style="width: 15%;">Total (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>
            <div class="item-title">${itemName}</div>
            <div class="item-subtitle">
              Category: ${itemCategory} &bull; Validity: ${itemValidity}
              ${
                  subscription?.planDetails?.features?.length
                      ? `<br />Features: ${subscription.planDetails.features.slice(0, 3).join(", ")}...`
                      : ""
              }
            </div>
          </td>
          <td class="center" style="font-family: monospace;">${company.sacCode}</td>
          <td class="center">${quantity}</td>
          <td class="right font-semibold">₹${taxDetails.subtotal.toFixed(2)}</td>
          <td class="right font-bold" style="color: #0f766e;">₹${taxDetails.total.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <!-- Financial Summary & Payment Breakdown -->
    <table class="summary-grid">
      <tr>
        <td class="payment-details-box">
          <div class="info-card">
            <div class="info-card-title">Payment Settlement Details</div>
            <div class="info-row">
              <span>Payment Gateway:</span>
              <strong>Razorpay Online Payment</strong>
            </div>
            <div class="info-row">
              <span>Payment Verified At:</span>
              <strong>${formattedPaymentDate}</strong>
            </div>
            <div class="info-row">
              <span>Payment Status:</span>
              <strong style="color: #059669;">Success & Captured</strong>
            </div>
            <div class="info-row">
              <span>Payment Currency:</span>
              <strong>${payment?.currency || "INR"}</strong>
            </div>
          </div>

          <div class="words-box">
            <strong>Amount in Words:</strong><br />
            <span>${amountInWords}</span>
          </div>
        </td>

        <td class="totals-box">
          <table class="totals-table">
            <tr>
              <td class="label">Taxable Subtotal</td>
              <td class="val">₹${taxDetails.subtotal.toFixed(2)}</td>
            </tr>
            ${
                taxDetails.isInterState
                    ? `<tr>
                        <td class="label">Integrated GST (IGST @ 18%)</td>
                        <td class="val">₹${taxDetails.igst.toFixed(2)}</td>
                      </tr>`
                    : `<tr>
                        <td class="label">Central GST (CGST @ 9%)</td>
                        <td class="val">₹${taxDetails.cgst.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td class="label">State GST (SGST @ 9%)</td>
                        <td class="val">₹${taxDetails.sgst.toFixed(2)}</td>
                      </tr>`
            }
            <tr>
              <td class="label">Total Tax Amount (18%)</td>
              <td class="val">₹${taxDetails.taxAmount.toFixed(2)}</td>
            </tr>
            <tr class="grand-total">
              <td>Total Amount Paid</td>
              <td style="text-align: right;">₹${taxDetails.total.toFixed(2)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Footer, Terms & Authorized Signatory -->
    <div class="footer-section">
      <table class="footer-table">
        <tr>
          <td class="legal-text">
            <strong>Terms & Conditions:</strong><br />
            1. This is a computer-generated electronic tax invoice and receipt issued under Section 31 of the CGST Act, 2017. No physical signature is required.<br />
            2. Subscription privileges and quota add-ons are activated immediately upon payment verification.<br />
            3. All payments and subscriptions are subject to the portal terms of service and Rajkot jurisdiction.<br />
            4. For billing assistance or invoice modifications, please write to: <strong>${company.email}</strong>.
          </td>
          <td class="signatory-box">
            <div class="signatory-title">For ${company.name}</div>
            <div class="signatory-name">Authorized Signatory</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Help Banner -->
    <div class="help-banner">
      Thank you for your business! &bull; ${company.name} &bull; ${company.email} &bull; Official Digital Receipt
    </div>
  </div>
</body>
</html>`;
};

/**
 * Render the HTML into an A4 PDF Buffer using Puppeteer
 */
export const renderInvoicePdfBuffer = async (html) => {
    let browser = null;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--font-render-hinting=none",
            ],
        });

        const page = await browser.newPage();
        await page.setViewport({
            width: 794,
            height: 1123,
            deviceScaleFactor: 2,
        });

        await page.setContent(html, {
            waitUntil: ["load", "domcontentloaded"],
            timeout: 20000,
        });

        const buffer = await page.pdf({
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: "0mm",
                right: "0mm",
                bottom: "0mm",
                left: "0mm",
            },
        });

        await browser.close();
        browser = null;

        return buffer;
    } catch (error) {
        if (browser) {
            try {
                await browser.close();
            } catch (_) {}
        }
        console.error("Puppeteer PDF generation error:", error);
        throw error;
    }
};

/**
 * Master function:
 * 1. Resolves customer & tax details
 * 2. Generates HTML & PDF
 * 3. Uploads PDF to Cloudflare R2
 * 4. Updates Payment and Subscription records
 */
export const generateAndUploadInvoice = async (
    payment,
    subscription = null,
    customerOverride = null
) => {
    if (!payment) return null;

    try {
        const company = getCompanyDetails();
        const customer = customerOverride || (await resolveCustomerDetails(payment));
        const taxDetails = calculateTaxDetails(payment.amount, customer.state);
        const invoiceNumber =
            payment.invoiceNumber || generateInvoiceNumber(payment.orderId, payment.createdAt);
        const invoiceDate = payment.invoiceDate || payment.createdAt || new Date();

        // Generate Invoice HTML
        const html = generateInvoiceHtml({
            company,
            customer,
            payment,
            subscription,
            invoiceNumber,
            taxDetails,
            invoiceDate,
        });

        // Generate PDF Buffer
        const pdfBuffer = await renderInvoicePdfBuffer(html);

        // Upload to Cloudflare R2
        const key = `invoices/${invoiceNumber}_${payment.paymentId || payment.orderId}.pdf`;
        const r2Upload = await uploadToR2({
            buffer: pdfBuffer,
            key,
            contentType: "application/pdf",
        });

        const invoiceUrl = r2Upload.url;

        // Update Payment record in Database
        payment.invoiceNumber = invoiceNumber;
        payment.invoiceUrl = invoiceUrl;
        payment.invoiceKey = key;
        payment.invoiceDate = invoiceDate;
        payment.taxDetails = taxDetails;
        payment.companyDetails = {
            name: company.name,
            gstin: company.gstin,
            address: company.address,
            email: company.email,
            logo: company.logo,
        };
        payment.customerDetails = {
            ...payment.customerDetails,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            state: customer.state,
            country: customer.country,
            pincode: customer.pincode,
            gstin: customer.gstin,
        };
        payment.pdfStatus = "generated";
        await payment.save();

        // Update Subscription record if present
        if (subscription && subscription.save) {
            subscription.invoiceNumber = invoiceNumber;
            subscription.invoiceUrl = invoiceUrl;
            subscription.invoiceKey = key;
            await subscription.save();
        } else if (payment._id) {
            try {
                const Subscription = mongoose.model("Subscription");
                await Subscription.updateOne(
                    { payment: payment._id },
                    {
                        $set: {
                            invoiceNumber,
                            invoiceUrl,
                            invoiceKey: key,
                        },
                    }
                );
            } catch (_) {}
        }

        return {
            success: true,
            invoiceNumber,
            invoiceUrl,
            invoiceKey: key,
            taxDetails,
            pdfBuffer,
            html,
        };
    } catch (err) {
        console.error("generateAndUploadInvoice failed:", err);
        // Mark payment as failed PDF generation so it can be retried
        if (payment && payment.save) {
            payment.pdfStatus = "failed";
            await payment.save().catch(() => {});
        }
        return {
            success: false,
            error: err.message,
        };
    }
};
