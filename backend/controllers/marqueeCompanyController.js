import MarqueeCompany, { DEFAULT_MARQUEE_COMPANIES } from "../models/MarqueeCompany.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { uploadToR2, deleteFromR2 } from "../utils/r2Storage.js";

// @desc    Get all active marquee companies (Public)
// @route   GET /api/marquee-companies
// @access  Public
export const getAllMarqueeCompanies = catchAsync(async (req, res, next) => {
  // If collection is completely empty, seed default initial marquee companies
  const totalCount = await MarqueeCompany.countDocuments();
  if (totalCount === 0) {
    try {
      await MarqueeCompany.insertMany(DEFAULT_MARQUEE_COMPANIES);
    } catch (seedError) {
      console.error("Error auto-seeding default marquee companies:", seedError);
    }
  }

  const companies = await MarqueeCompany.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: companies.length,
    data: companies,
  });
});

// @desc    Get all marquee companies for admin (includes inactive)
// @route   GET /api/marquee-companies/admin
// @access  Private (Admin)
export const getAdminMarqueeCompanies = catchAsync(async (req, res, next) => {
  const totalCount = await MarqueeCompany.countDocuments();
  if (totalCount === 0) {
    try {
      await MarqueeCompany.insertMany(DEFAULT_MARQUEE_COMPANIES);
    } catch (seedError) {
      console.error("Error auto-seeding default marquee companies:", seedError);
    }
  }

  const companies = await MarqueeCompany.find()
    .sort({ order: 1, createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: companies.length,
    data: companies,
  });
});

// @desc    Get single marquee company by ID
// @route   GET /api/marquee-companies/:id
// @access  Public
export const getMarqueeCompanyById = catchAsync(async (req, res, next) => {
  const company = await MarqueeCompany.findById(req.params.id);
  if (!company) {
    return next(new AppError("Marquee company not found", 404));
  }

  res.status(200).json({
    success: true,
    data: company,
  });
});

// @desc    Create new marquee company
// @route   POST /api/marquee-companies
// @access  Private (Admin)
export const createMarqueeCompany = catchAsync(async (req, res, next) => {
  const { name, logo, websiteUrl, order, isActive } = req.body;

  let logoUrl = logo ? String(logo).trim() : "";

  // If a file was uploaded, upload to R2
  if (req.file) {
    const ext = req.file.originalname.split(".").pop() || "png";
    const key = `marquee-logos/company-${Date.now()}-${Math.round(Math.random() * 1e4)}.${ext}`;
    const { url } = await uploadToR2({
      buffer: req.file.buffer,
      key,
      contentType: req.file.mimetype || "image/png",
    });
    logoUrl = url;
  }

  if (!name || !name.trim()) {
    return next(new AppError("Company name is required", 400));
  }

  if (!logoUrl) {
    return next(new AppError("Company logo URL or image upload is required", 400));
  }

  const newCompany = await MarqueeCompany.create({
    name: name.trim(),
    logo: logoUrl,
    websiteUrl: websiteUrl ? websiteUrl.trim() : "",
    order: order !== undefined && order !== null && order !== "" ? Number(order) : 0,
    isActive: isActive !== undefined ? Boolean(isActive === "true" || isActive === true) : true,
  });

  res.status(201).json({
    success: true,
    message: "Company added to marquee successfully",
    data: newCompany,
  });
});

// @desc    Update marquee company
// @route   PUT /api/marquee-companies/:id
// @access  Private (Admin)
export const updateMarqueeCompany = catchAsync(async (req, res, next) => {
  const company = await MarqueeCompany.findById(req.params.id);
  if (!company) {
    return next(new AppError("Marquee company not found", 404));
  }

  const { name, logo, websiteUrl, order, isActive } = req.body;

  let logoUrl = logo !== undefined ? String(logo).trim() : company.logo;

  // If a new image file was uploaded
  if (req.file) {
    // Delete old uploaded logo if stored in R2
    if (company.logo && company.logo.includes("marquee-logos")) {
      await deleteFromR2(company.logo);
    }

    const ext = req.file.originalname.split(".").pop() || "png";
    const key = `marquee-logos/company-${Date.now()}-${Math.round(Math.random() * 1e4)}.${ext}`;
    const { url } = await uploadToR2({
      buffer: req.file.buffer,
      key,
      contentType: req.file.mimetype || "image/png",
    });
    logoUrl = url;
  }

  if (name !== undefined) company.name = name.trim();
  if (logoUrl) company.logo = logoUrl;
  if (websiteUrl !== undefined) company.websiteUrl = websiteUrl.trim();
  if (order !== undefined && order !== null && order !== "") company.order = Number(order);
  if (isActive !== undefined) {
    company.isActive = Boolean(isActive === "true" || isActive === true);
  }

  await company.save();

  res.status(200).json({
    success: true,
    message: "Marquee company updated successfully",
    data: company,
  });
});

// @desc    Delete marquee company
// @route   DELETE /api/marquee-companies/:id
// @access  Private (Admin)
export const deleteMarqueeCompany = catchAsync(async (req, res, next) => {
  const company = await MarqueeCompany.findById(req.params.id);
  if (!company) {
    return next(new AppError("Marquee company not found", 404));
  }

  // Delete logo from R2 if uploaded
  if (company.logo && company.logo.includes("marquee-logos")) {
    await deleteFromR2(company.logo);
  }

  await MarqueeCompany.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Company deleted from marquee successfully",
  });
});

// @desc    Toggle active status of marquee company
// @route   PATCH /api/marquee-companies/:id/status
// @access  Private (Admin)
export const toggleMarqueeCompanyStatus = catchAsync(async (req, res, next) => {
  const company = await MarqueeCompany.findById(req.params.id);
  if (!company) {
    return next(new AppError("Marquee company not found", 404));
  }

  if (req.body.isActive !== undefined) {
    company.isActive = Boolean(req.body.isActive);
  } else {
    company.isActive = !company.isActive;
  }

  await company.save();

  res.status(200).json({
    success: true,
    message: `Company ${company.isActive ? "activated" : "deactivated"} successfully`,
    data: company,
  });
});

// @desc    Seed or reset default marquee companies
// @route   POST /api/marquee-companies/seed
// @access  Private (Admin)
export const seedMarqueeCompanies = catchAsync(async (req, res, next) => {
  const { reset } = req.body;

  if (reset) {
    await MarqueeCompany.deleteMany({});
  }

  const existingCount = await MarqueeCompany.countDocuments();
  if (existingCount === 0 || reset) {
    await MarqueeCompany.insertMany(DEFAULT_MARQUEE_COMPANIES);
  }

  const allCompanies = await MarqueeCompany.find().sort({ order: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Default marquee companies seeded successfully",
    data: allCompanies,
  });
});
