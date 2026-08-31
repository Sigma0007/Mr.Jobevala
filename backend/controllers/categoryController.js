import Category from "../models/Category.js";
import Job from "../models/Job.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

const DEFAULT_CATEGORIES = [
    {
        title: "Accounting / Finance",
        value: "accounting-finance",
    },
    {
        title: "Marketing",
        value: "marketing",
    },
    {
        title: "Design",
        value: "design",
    },
    {
        title: "Development",
        value: "development",
    },
    {
        title: "Human Resource",
        value: "human-resource",
    },
    {
        title: "Automotive Jobs",
        value: "automotive-jobs",
    },
    {
        title: "Customer Service",
        value: "customer-service",
    },
    {
        title: "Health and Care",
        value: "health-and-care",
    },
    {
        title: "Project Management",
        value: "project-management",
    },
];

// @desc    Get all categories (Open / Public)
// @route   GET /api/categories
// @access  Public
export const getAllCategories = catchAsync(async (req, res, next) => {
    let categories = await Category.find().sort({ createdAt: 1 });

    // Seed default categories if none exist in the database yet
    if (categories.length === 0) {
        try {
            await Category.insertMany(DEFAULT_CATEGORIES);
            categories = await Category.find().sort({ createdAt: 1 });
        } catch (error) {
            // If already inserted concurrently or error, just fetch again
            categories = await Category.find().sort({ createdAt: 1 });
        }
    }

    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
    });
});

// @desc    Get categories with open position / job count
// @route   GET /api/categories/job-counts
// @access  Public
export const getCategoryJobCounts = catchAsync(async (req, res, next) => {
    let categories = await Category.find().sort({ createdAt: 1 });

    // Seed default categories if none exist in the database yet
    if (categories.length === 0) {
        try {
            await Category.insertMany(DEFAULT_CATEGORIES);
            categories = await Category.find().sort({ createdAt: 1 });
        } catch (error) {
            categories = await Category.find().sort({ createdAt: 1 });
        }
    }

    // Aggregate active jobs count & vacancies per category
    const jobStats = await Job.aggregate([
        {
            $match: {
                status: "active",
            },
        },
        {
            $group: {
                _id: { $toLower: { $trim: { input: { $ifNull: ["$category", ""] } } } },
                count: { $sum: { $ifNull: ["$vacancies", 1] } },
                jobCount: { $sum: 1 },
            },
        },
    ]);

    const countMap = {};
    jobStats.forEach((stat) => {
        if (stat._id) {
            countMap[stat._id] = stat.count;
        }
    });

    const categoryCounts = await Promise.all(
        categories.map(async (cat) => {
            const valKey = (cat.value || "").toLowerCase().trim();
            const titleKey = (cat.title || "").toLowerCase().trim();

            let count = countMap[valKey] !== undefined ? countMap[valKey] : countMap[titleKey];

            // If not directly in map, perform regex match query for flexible matching
            if (count === undefined) {
                const matched = await Job.aggregate([
                    {
                        $match: {
                            status: "active",
                            $or: [
                                { category: { $regex: new RegExp(`^${cat.value}$`, "i") } },
                                { category: { $regex: new RegExp(`^${cat.title}$`, "i") } },
                            ],
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: { $ifNull: ["$vacancies", 1] } },
                        },
                    },
                ]);
                count = matched.length > 0 ? matched[0].total : 0;
            }

            return {
                _id: cat._id,
                title: cat.title,
                value: cat.value,
                count: String(count || 0),
            };
        })
    );

    res.status(200).json({
        success: true,
        count: categoryCounts.length,
        data: categoryCounts,
    });
});

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    res.status(200).json({
        success: true,
        category,
    });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = catchAsync(async (req, res, next) => {
    let { title, value } = req.body;

    if (!title) {
        return next(new AppError("Category title is required", 400));
    }

    if (!value) {
        // Auto-generate value slug from title if not provided
        value = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    } else {
        value = value.toLowerCase().trim();
    }

    const existingCategory = await Category.findOne({
        $or: [{ value }, { title: { $regex: new RegExp(`^${title.trim()}$`, "i") } }],
    });

    if (existingCategory) {
        return next(
            new AppError("Category with this title or value already exists", 400)
        );
    }

    const category = await Category.create({
        title: title.trim(),
        value,
    });

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        category,
    });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = catchAsync(async (req, res, next) => {
    const { title, value } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    if (title) {
        category.title = title.trim();
    }

    if (value) {
        const cleanValue = value.toLowerCase().trim();
        // Check uniqueness if value is changing
        if (cleanValue !== category.value) {
            const existingValue = await Category.findOne({
                value: cleanValue,
                _id: { $ne: req.params.id },
            });
            if (existingValue) {
                return next(new AppError("Category value/slug already in use", 400));
            }
            category.value = cleanValue;
        }
    } else if (title && !value) {
        // Optionally update value if title changed and value wasn't explicitly provided
        const newSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        const existingSlug = await Category.findOne({
            value: newSlug,
            _id: { $ne: req.params.id },
        });
        if (!existingSlug) {
            category.value = newSlug;
        }
    }

    await category.save();

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category,
    });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
    });
});
