import puppeteer from "puppeteer";

/**
 * Controller to generate real A4 PDF using Puppeteer from complete Resume HTML
 * POST /api/resume/pdf
 */
export const generateResumePdf = async (req, res) => {
  let browser = null;
  try {
    const { html, title = "resume" } = req.body;

    if (!html || typeof html !== "string") {
      return res.status(400).json({
        success: false,
        message: "HTML content is required for PDF generation"
      });
    }

    // Launch headless Chromium
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--font-render-hinting=none"
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2
    });
    await page.emulateMediaType("screen");

    // Complete standalone HTML document with embedded fonts, CSS variables & all template stylesheets
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
          <style>
            :root {
              --primary-color: #2563eb;
              --primary-light: rgba(37, 99, 235, 0.08);
              --primary-border: rgba(37, 99, 235, 0.25);
              --resume-font: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              --text-main: #1e293b;
              --text-muted: #64748b;
              --text-light: #94a3b8;
              --bg-page: #ffffff;
            }

            @page {
              size: A4 portrait;
              margin-top: 14mm;
              margin-bottom: 14mm;
              margin-left: 0mm;
              margin-right: 0mm;
            }

            @page :first {
              margin-top: 0mm;
              margin-bottom: 14mm;
            }

            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }

            html, body {
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color: var(--text-main);
              font-family: var(--resume-font);
            }

            svg {
              display: inline-block;
              vertical-align: middle;
            }

            /* Base Resume Page Layout */
            .resume-page-wrapper {
              display: block;
              padding: 0;
              margin: 0;
              background: transparent;
            }

            .resume-page {
              width: 210mm !important;
              min-height: 297mm !important;
              background-color: var(--bg-page);
              box-sizing: border-box;
              color: var(--text-main);
              font-family: var(--resume-font);
              font-size: 13px;
              line-height: 1.5;
              position: relative;
              margin: 0 auto !important;
              box-shadow: none !important;
              border: none !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* Page Break Protection */
            .resume-section-block,
            .resume-item,
            .resume-exp-item,
            .resume-edu-item,
            .resume-proj-item,
            .resume-cert-item {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            /* Links */
            .resume-page a {
              color: inherit;
              text-decoration: none;
            }

            /* Contacts & Icons */
            .contact-item {
              display: inline-flex;
              align-items: center;
              gap: 0.35rem;
              font-size: 0.85rem;
              color: var(--text-muted);
            }

            .contact-item svg {
              width: 14px;
              height: 14px;
              flex-shrink: 0;
              color: var(--primary-color);
            }

            /* Skill Tags */
            .resume-skill-tag {
              display: inline-flex;
              align-items: center;
              padding: 0.2rem 0.6rem;
              background-color: #f1f5f9;
              color: #334155;
              border-radius: 4px;
              font-size: 0.8rem;
              font-weight: 500;
              border: 1px solid #e2e8f0;
            }

            /* ============================================================
               TEMPLATE 1: MODERN
               ============================================================ */
            .modern-template {
              display: flex;
              flex-direction: column;
              min-height: 297mm;
            }

            .modern-header {
              background: linear-gradient(135deg, var(--primary-color) 0%, #0f172a 100%);
              color: #ffffff;
              padding: 28px 32px;
              display: flex;
              align-items: center;
              gap: 24px;
            }

            .modern-header .profile-photo {
              width: 88px;
              height: 88px;
              border-radius: 50%;
              object-fit: cover;
              border: 3px solid rgba(255, 255, 255, 0.8);
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }

            .modern-header .header-info {
              flex: 1;
            }

            .modern-header h1 {
              font-size: 26px;
              font-weight: 700;
              letter-spacing: -0.02em;
              margin: 0 0 4px 0;
              color: #ffffff;
            }

            .modern-header .job-title {
              font-size: 15px;
              font-weight: 500;
              color: rgba(255, 255, 255, 0.9);
              margin-bottom: 12px;
            }

            .modern-header .contacts-row {
              display: flex;
              flex-wrap: wrap;
              gap: 12px 18px;
              font-size: 12px;
              color: rgba(255, 255, 255, 0.85);
            }

            .modern-header .contacts-row .contact-item {
              color: rgba(255, 255, 255, 0.9);
            }

            .modern-header .contacts-row .contact-item svg {
              color: rgba(255, 255, 255, 0.9);
            }

            .modern-body {
              display: grid;
              grid-template-columns: 2fr 1fr;
              gap: 24px;
              padding: 28px 32px;
              flex: 1;
            }

            .modern-main-col {
              display: flex;
              flex-direction: column;
              gap: 22px;
            }

            .modern-side-col {
              display: flex;
              flex-direction: column;
              gap: 20px;
              border-left: 1px solid #f1f5f9;
              padding-left: 20px;
            }

            .modern-section-title {
              font-size: 13px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: var(--primary-color);
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              gap: 8px;
              border-bottom: 2px solid var(--primary-light);
              padding-bottom: 4px;
            }

            /* ============================================================
               TEMPLATE 2: PROFESSIONAL
               ============================================================ */
            .professional-template {
              padding: 36px 40px;
              min-height: 297mm;
              box-sizing: border-box;
            }

            .prof-header {
              border-bottom: 2px solid var(--primary-color);
              padding-bottom: 18px;
              margin-bottom: 22px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }

            .prof-header h1 {
              font-size: 28px;
              font-weight: 800;
              color: #0f172a;
              letter-spacing: -0.02em;
              margin: 0 0 4px 0;
            }

            .prof-header .job-title {
              font-size: 16px;
              font-weight: 600;
              color: var(--primary-color);
              margin-bottom: 12px;
            }

            .prof-header .contacts-grid {
              display: flex;
              flex-wrap: wrap;
              gap: 8px 18px;
              font-size: 12px;
            }

            .prof-header .profile-photo {
              width: 90px;
              height: 90px;
              border-radius: 8px;
              object-fit: cover;
              border: 2px solid #e2e8f0;
            }

            .prof-section {
              margin-bottom: 20px;
            }

            .prof-section-title {
              font-size: 14px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: var(--primary-color);
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 4px;
              margin-bottom: 12px;
            }

            .prof-timeline-item {
              margin-bottom: 14px;
            }

            .prof-timeline-header {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              margin-bottom: 2px;
            }

            .prof-item-title {
              font-weight: 700;
              font-size: 13.5px;
              color: #0f172a;
            }

            .prof-item-subtitle {
              font-weight: 600;
              color: var(--primary-color);
              font-size: 12.5px;
            }

            .prof-item-date {
              font-size: 11.5px;
              color: var(--text-muted);
              font-weight: 500;
            }

            .prof-desc {
              font-size: 12px;
              color: #334155;
              white-space: pre-line;
              margin-top: 4px;
              line-height: 1.55;
            }

            /* ============================================================
               TEMPLATE 3: MINIMAL
               ============================================================ */
            .minimal-template {
              padding: 40px 48px;
              min-height: 297mm;
              box-sizing: border-box;
            }

            .minimal-header {
              text-align: center;
              margin-bottom: 28px;
              padding-bottom: 18px;
              border-bottom: 1px solid #e2e8f0;
            }

            .minimal-header h1 {
              font-size: 30px;
              font-weight: 300;
              letter-spacing: 0.04em;
              color: #0f172a;
              margin: 0 0 4px 0;
            }

            .minimal-header .job-title {
              font-size: 14px;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: var(--primary-color);
              font-weight: 600;
              margin-bottom: 12px;
            }

            .minimal-header .contacts-row {
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
              gap: 8px 16px;
              font-size: 12px;
            }

            .minimal-section {
              margin-bottom: 22px;
            }

            .minimal-section-title {
              font-size: 12px;
              font-weight: 600;
              letter-spacing: 0.15em;
              text-transform: uppercase;
              color: var(--text-muted);
              margin-bottom: 12px;
              position: relative;
            }

            .minimal-section-title::after {
              content: "";
              display: block;
              width: 24px;
              height: 2px;
              background-color: var(--primary-color);
              margin-top: 4px;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    await page.setContent(fullHtml, {
      waitUntil: ["load", "networkidle0"],
      timeout: 30000
    });

    // Generate real A4 PDF buffer with high fidelity
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px"
      }
    });

    await browser.close();
    browser = null;

    const safeFilename = `${title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.end(pdfBuffer);
  } catch (error) {
    if (browser) {
      try {
        await browser.close();
      } catch (err) {
        console.error("Error closing puppeteer browser:", err);
      }
    }
    console.error("Error generating resume PDF:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate PDF document",
      error: error.message
    });
  }
};
