import Category from "../models/Category.js";
import Job from "../models/Job.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const DEFAULT_CATEGORIES = [
    {
        label: "Banking, Financial Services & Insurance",
        value: "banking_financial_services_insurance",
        roles: [
            { label: "Banking Operations", value: "banking_operations" },
            { label: "Collections / Recovery", value: "collections_recovery" },
            { label: "Insurance", value: "insurance" },
            { label: "Lending Operations", value: "lending_operations" },
            { label: "Trading Management", value: "trading_management" },
            { label: "Asset Management", value: "asset_management" },
            { label: "Wealth Management", value: "wealth_management" },
        ],
    },
    {
        label: "Beauty & Personal Care",
        value: "beauty_personal_care",
        roles: [
            { label: "Beautician", value: "beautician" },
            { label: "Hair Stylist / Barber", value: "hair_stylist_barber" },
            { label: "Salon Management", value: "salon_management" },
        ],
    },
    {
        label: "Construction & Site Engineering",
        value: "construction_site_engineering",
        roles: [
            { label: "Construction Engineering", value: "construction_engineering" },
            { label: "Construction Surveying", value: "construction_surveying" },
            { label: "Project & Site Management", value: "project_site_management" },
        ],
    },
    {
        label: "Content, Editorial & Journalism",
        value: "content_editorial_journalism",
        roles: [
            { label: "Content Writing and Editing", value: "content_writing_editing" },
            { label: "Journalism", value: "journalism" },
        ],
    },
    {
        label: "Customer Support",
        value: "customer_support",
        roles: [
            { label: "Customer Success / Account Handling", value: "customer_success_account_handling" },
            { label: "International Telecalling", value: "international_telecalling" },
            { label: "Non Voice / Chat", value: "non_voice_chat" },
            { label: "Team Leader / Management / Operations", value: "team_leader_management_operations" },
            { label: "Telecalling / BPO", value: "telecalling_bpo" },
            { label: "Telesales", value: "telesales" },
        ],
    },
    {
        label: "Data Science & Analytics",
        value: "data_science_analytics",
        roles: [
            { label: "Business Intelligence & Analytics", value: "business_intelligence_analytics" },
            { label: "Data Science & Machine Learning", value: "data_science_machine_learning" },
        ],
    },
    {
        label: "Delivery / Driver",
        value: "delivery_driver",
        roles: [
            { label: "Delivery", value: "delivery" },
            { label: "Heavy Vehicle Driver", value: "heavy_vehicle_driver" },
            { label: "Light Vehicle Driver", value: "light_vehicle_driver" },
        ],
    },
    {
        label: "Design, Editing & Architecture",
        value: "design_editing_architecture",
        roles: [
            { label: "Architecture & Interior Design", value: "architecture_interior_design" },
            { label: "DTP", value: "dtp" },
            { label: "Graphic Designer", value: "graphic_designer" },
            { label: "UI / UX", value: "ui_ux" },
            { label: "Visual/Audio Editing", value: "visual_audio_editing" },
        ],
    },
    {
        label: "Engineering - Hardware & Networks",
        value: "engineering_hardware_networks",
        roles: [
            { label: "Hardware", value: "hardware" },
            { label: "IT Networking", value: "it_networking" },
            { label: "Telecom", value: "telecom" },
        ],
    },
    {
        label: "Fashion & Tailoring",
        value: "fashion_tailoring",
        roles: [
            { label: "Fashion & Accessories", value: "fashion_accessories" },
            { label: "Tailoring / Garment", value: "tailoring_garment" },
        ],
    },
    {
        label: "Finance & Accounting",
        value: "finance_accounting",
        roles: [
            { label: "Accounting & Taxation", value: "accounting_taxation" },
            { label: "Audit & Control", value: "audit_control" },
            { label: "Billing / Cashier", value: "billing_cashier" },
            { label: "Finance", value: "finance" },
            { label: "MIS Operations", value: "mis_operations" },
            { label: "Payables / Receivables Management", value: "payables_receivables_management" },
            { label: "Payroll & Transactions", value: "payroll_transactions" },
            { label: "Treasury", value: "treasury" },
        ],
    },
    {
        label: "Healthcare / Doctor / Hospital Staff",
        value: "healthcare_doctor_hospital_staff",
        roles: [
            { label: "Doctor", value: "doctor" },
            { label: "Hospital Admin/Staff", value: "hospital_admin_staff" },
            { label: "Imaging & Diagnostics", value: "imaging_diagnostics" },
            { label: "Lab Technician", value: "lab_technician" },
            { label: "Nurse", value: "nurse" },
            { label: "Pharmacist", value: "pharmacist" },
            { label: "Ward Helper", value: "ward_helper" },
        ],
    },
    {
        label: "House Help / Worker",
        value: "house_help_worker",
        roles: [
            { label: "Baby Care / Caretaker / Elder Care", value: "baby_care_caretaker_elder_care" },
            { label: "Cleaning", value: "cleaning" },
            { label: "Gardener", value: "gardener" },
            { label: "Home Cook", value: "home_cook" },
            { label: "Home Nurse", value: "home_nurse" },
            { label: "Maid", value: "maid" },
        ],
    },
    {
        label: "Human Resources",
        value: "human_resources",
        roles: [
            { label: "HR Business Advisory", value: "hr_business_advisory" },
            { label: "HR Operations / Employee Relations", value: "hr_operations_employee_relations" },
            { label: "Recruitment & Talent Acquisition", value: "recruitment_talent_acquisition" },
        ],
    },
    {
        label: "Labour / Factory Worker",
        value: "labour_factory_worker",
        roles: [
            { label: "Factory Worker", value: "factory_worker" },
            { label: "Labour", value: "labour" },
        ],
    },
    {
        label: "Legal & Regulatory",
        value: "legal_regulatory",
        roles: [
            { label: "Civil Law", value: "civil_law" },
            { label: "Corporate Affairs", value: "corporate_affairs" },
            { label: "Crime / Arbitration", value: "crime_arbitration" },
            { label: "Legal Operations", value: "legal_operations" },
        ],
    },
    {
        label: "Marketing / Brand / Digital Marketing",
        value: "marketing_brand_digital_marketing",
        roles: [
            { label: "Advertising & Creative", value: "advertising_creative" },
            { label: "Brand Marketing", value: "brand_marketing" },
            { label: "Digital Marketing", value: "digital_marketing" },
            { label: "Ecommerce Operations", value: "ecommerce_operations" },
            { label: "Market Research & Insights", value: "market_research_insights" },
            { label: "Marketing", value: "marketing" },
        ],
    },
    {
        label: "Media Production & Entertainment",
        value: "media_production_entertainment",
        roles: [
            { label: "Animation / Effects", value: "animation_effects" },
            { label: "Direction / Production / Artists", value: "direction_production_artists" },
            { label: "Make Up / Costume", value: "make_up_costume" },
            { label: "Photographer / Videographer", value: "photographer_videographer" },
        ],
    },
    {
        label: "Office / Admin / Computer Operator",
        value: "office_admin_computer_operator",
        roles: [
            { label: "Administration", value: "administration" },
            { label: "Back Office", value: "back_office" },
            { label: "Data Entry/Computer Operator", value: "data_entry_computer_operator" },
            { label: "Facility / Property Management", value: "facility_property_management" },
            { label: "Front Office / Receptionist", value: "front_office_receptionist" },
            { label: "Office Help / Peon", value: "office_help_peon" },
        ],
    },
    {
        label: "Operations",
        value: "operations",
        roles: [
            { label: "Ecommerce Operations", value: "ecommerce_operations" },
            { label: "Logistics Operations", value: "logistics_operations" },
            { label: "Manufacturing/Production", value: "manufacturing_production" },
            { label: "Quality Control", value: "quality_control" },
        ],
    },
    {
        label: "Production, Manufacturing & Engineering",
        value: "production_manufacturing_engineering",
        roles: [
            { label: "Engineering", value: "engineering" },
            { label: "Machine Operator", value: "machine_operator" },
            { label: "Management", value: "management" },
            { label: "Manufacturing/Production Quality", value: "manufacturing_production_quality" },
        ],
    },
    {
        label: "Purchase & Supply Chain",
        value: "purchase_supply_chain",
        roles: [
            { label: "Import & Export", value: "import_export" },
            { label: "Procurement & Purchase", value: "procurement_purchase" },
            { label: "Quality Management", value: "quality_management" },
            { label: "Stores & Material Management", value: "stores_material_management" },
            { label: "Warehousing", value: "warehousing" },
        ],
    },
    {
        label: "Restaurant / Hospitality / Tourism",
        value: "restaurant_hospitality_tourism",
        roles: [
            { label: "Event Management", value: "event_management" },
            { label: "Front Office & Guest Services", value: "front_office_guest_services" },
            { label: "Front Office / Receptionist", value: "front_office_receptionist" },
            { label: "Hospitality Management", value: "hospitality_management" },
            { label: "Hotel Cook / Chef", value: "hotel_cook_chef" },
            { label: "Housekeeping & Laundry", value: "housekeeping_laundry" },
            { label: "Restaurant Staff / Waiter / Kitchen Help", value: "restaurant_staff_waiter_kitchen_help" },
            { label: "Travel / Tourism Services", value: "travel_tourism_services" },
        ],
    },
    {
        label: "Sales & Business Development",
        value: "sales_business_development",
        roles: [
            { label: "Business Development / Lead Generation", value: "business_development_lead_generation" },
            { label: "Enterprise & B2B Sales", value: "enterprise_b2b_sales" },
            { label: "Field Sales", value: "field_sales" },
            { label: "Inside Sales", value: "inside_sales" },
            { label: "Retail / Counter Sales / B2C", value: "retail_counter_sales_b2c" },
            { label: "Sales Management", value: "sales_management" },
            { label: "Sales Support & Operations", value: "sales_support_operations" },
            { label: "Stores & Material Management", value: "stores_material_management" },
            { label: "Telesales", value: "telesales" },
        ],
    },
    {
        label: "Security Services",
        value: "security_services",
        roles: [
            { label: "Security Guard", value: "security_guard" },
            { label: "Security Management", value: "security_management" },
        ],
    },
    {
        label: "Software Engineering",
        value: "software_engineering",
        roles: [
            { label: "Backend Development", value: "backend_development" },
            { label: "DBA / Data warehousing", value: "dba_data_warehousing" },
            { label: "DevOps", value: "devops" },
            { label: "Frontend Development", value: "frontend_development" },
            { label: "Full Stack Development", value: "full_stack_development" },
            { label: "IT & Information Security", value: "it_information_security" },
            { label: "Project Management", value: "project_management" },
            { label: "Quality Assurance and Testing", value: "quality_assurance_testing" },
            { label: "Software Development", value: "software_development" },
        ],
    },
    {
        label: "Sports, Health & Fitness",
        value: "sports_health_fitness",
        roles: [
            { label: "Gym/Fitness trainer", value: "gym_fitness_trainer" },
            { label: "Nutritionist", value: "nutritionist" },
            { label: "Sports Science & Medicine", value: "sports_science_medicine" },
            { label: "Sports Staff and Management", value: "sports_staff_management" },
            { label: "Yoga trainer", value: "yoga_trainer" },
        ],
    },
    {
        label: "Teaching & Training",
        value: "teaching_training",
        roles: [
            { label: "Administration & Staff", value: "administration_staff" },
            { label: "Corporate Training", value: "corporate_training" },
            { label: "Counsellor", value: "counsellor" },
            { label: "Extra Curricular Activity", value: "extra_curricular_activity" },
            { label: "Language Teacher", value: "language_teacher" },
            { label: "Preschool & Primary Education", value: "preschool_primary_education" },
            { label: "Subject / Specialization Teacher", value: "subject_specialization_teacher" },
            { label: "University Level Educator", value: "university_level_educator" },
        ],
    },
    {
        label: "Technician / Vehicle Service",
        value: "technician_vehicle_service",
        roles: [
            { label: "AC / Refrigeration / HVAC / Aquaguard", value: "ac_refrigeration_hvac_aquaguard" },
            { label: "Carpentry and Woodworking", value: "carpentry_woodworking" },
            { label: "Electrical", value: "electrical" },
            { label: "Electronics", value: "electronics" },
            { label: "Elevator and Lift Maintenance", value: "elevator_lift_maintenance" },
            { label: "Factory Worker", value: "factory_worker" },
            { label: "Fitter / Welder", value: "fitter_welder" },
            { label: "Jewelry Design and Decoration", value: "jewelry_design_decoration" },
            { label: "Machine Operator", value: "machine_operator" },
            { label: "Painter", value: "painter" },
            { label: "Pest Control", value: "pest_control" },
            { label: "Plumber", value: "plumber" },
            { label: "Security / Fire / Safety", value: "security_fire_safety" },
            { label: "Technician", value: "technician" },
            { label: "Vehicle Service", value: "vehicle_service" },
        ],
    },
    {
        label: "Others",
        value: "others",
        roles: [{ label: "Others", value: "others" }],
    },
];

// Helper to ensure database has default categories if collection is empty
const ensureCategoriesSeeded = async () => {
    const count = await Category.countDocuments();
    if (count === 0) {
        try {
            await Category.insertMany(DEFAULT_CATEGORIES);
        } catch (error) {
            console.error("Error inserting default categories:", error);
        }
    }
};

// @desc    Get all categories (Open / Public)
// @route   GET /api/categories
// @access  Public
export const getAllCategories = catchAsync(async (req, res, next) => {
    await ensureCategoriesSeeded();

    const categories = await Category.find().sort({ createdAt: 1 });

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
    await ensureCategoriesSeeded();

    const categories = await Category.find().sort({ createdAt: 1 });

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
            const labelKey = (cat.label || "").toLowerCase().trim();

            let count = countMap[valKey] !== undefined
                ? countMap[valKey]
                : countMap[labelKey];

            // If not directly in map, perform regex match query for flexible matching
            if (count === undefined) {
                const matched = await Job.aggregate([
                    {
                        $match: {
                            status: "active",
                            $or: [
                                { category: { $regex: new RegExp(`^${cat.value}$`, "i") } },
                                { category: { $regex: new RegExp(`^${cat.label}$`, "i") } },
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
                label: cat.label,
                value: cat.value,
                roles: cat.roles || [],
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
    let { label, value, roles } = req.body;
    const categoryLabel = label;

    if (!categoryLabel) {
        return next(new AppError("Category label is required", 400));
    }

    if (!value) {
        // Auto-generate value slug from label if not provided
        value = categoryLabel
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/(^_|_$)/g, "");
    } else {
        value = value.toLowerCase().trim();
    }

    const existingCategory = await Category.findOne({
        $or: [
            { value },
            { label: { $regex: new RegExp(`^${categoryLabel.trim()}$`, "i") } },
        ],
    });

    if (existingCategory) {
        return next(
            new AppError("Category with this label or value already exists", 400)
        );
    }

    const category = await Category.create({
        label: categoryLabel.trim(),
        value,
        roles: Array.isArray(roles) ? roles : [],
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
    const { label, value, roles } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    const categoryLabel = label;
    if (categoryLabel) {
        category.label = categoryLabel.trim();
    }

    if (roles !== undefined && Array.isArray(roles)) {
        category.roles = roles;
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
    } else if (categoryLabel && !value) {
        const newSlug = categoryLabel
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/(^_|_$)/g, "");
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
