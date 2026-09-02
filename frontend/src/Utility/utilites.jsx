import {
  Clock,
  Eye,
  Bookmark,
  Calendar,
  CheckCircle2,
  XCircle,
  Calculator,
  Megaphone,
  PenTool,
  Code2,
  Users,
  Car,
  HeadphonesIcon,
  HeartPulse,
  Briefcase,
} from "lucide-react";

export const statusConfig = {
  pending: {
    color: "bg-blue-50 text-blue-600 border-blue-100",
    icon: Clock,
    name: "Pending",
  },
  reviewed: {
    color: "bg-purple-50 text-purple-600 border-purple-100",
    icon: Eye,
    name: "Reviewed",
  },
  shortlisted: {
    color: "bg-yellow-50 text-yellow-600 border-yellow-100",
    icon: Bookmark,
    name: "Shortlisted",
  },
  interview: {
    color: "bg-amber-50 text-amber-600 border-amber-100",
    icon: Calendar,
    name: "Interview",
  },
  hired: {
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: CheckCircle2,
    name: "Hired",
  },
  rejected: {
    color: "bg-red-50 text-red-600 border-red-100",
    icon: XCircle,
    name: "Rejected",
  },
};

export const workModeType = [
  { label: "On-site", value: "on-site" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
];

export const jobType = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
  { label: "Freelance", value: "freelance" },
];

export const qualificationTypes = [
  { label: "10th Pass", value: "10th pass" },
  { label: "12th Pass", value: "12th pass" },
  { label: "Graduate", value: "graduate" },
  { label: "Post Graduate", value: "post graduate" },
  { label: "Diploma", value: "diploma" },
];

export const genderPreferenceTypes = [
  { label: "No Preference / Any", value: "any" },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export const jobShiftTypes = [
  { label: "Day", value: "day" },
  { label: "Morning", value: "morning" },
  { label: "Evening", value: "evening" },
  { label: "Night", value: "night" },
];

export const SalaryRangeType = [
  { label: "Any Salary", value: "Any Salary" },
  { label: "₹0 - ₹30k", value: "0-30000" },
  { label: "₹30k - ₹60k", value: "30000-60000" },
  { label: "₹60k - ₹100k", value: "60000-100000" },
  { label: "₹100k+", value: "100000+" },
];

export const ExperienceType = [
  { label: "0-1 year", value: "0-1" },
  { label: "1-3 years", value: "1-3" },
  { label: "3-5 years", value: "3-5" },
  { label: "5-10 years", value: "5-10" },
  { label: "10+ years", value: "10+" },
];

export const CATEGORIES = [
  {
    title: "Accounting / Finance",
    value: "accounting-finance",
    count: "2 open positions",
    icon: Calculator,
  },
  {
    title: "Marketing",
    value: "marketing",
    count: "86 open positions",
    icon: Megaphone,
  },
  {
    title: "Design",
    value: "design",
    count: "43 open positions",
    icon: PenTool,
  },
  {
    title: "Development",
    value: "development",
    count: "12 open positions",
    icon: Code2,
  },
  {
    title: "Human Resource",
    value: "human-resource",
    count: "55 open positions",
    icon: Users,
  },
  {
    title: "Automotive Jobs",
    value: "automotive-jobs",
    count: "2 open positions",
    icon: Car,
  },
  {
    title: "Customer Service",
    value: "customer-service",
    count: "2 open positions",
    icon: HeadphonesIcon,
  },
  {
    title: "Health and Care",
    value: "health-and-care",
    count: "25 open positions",
    icon: HeartPulse,
  },
  {
    title: "Project Management",
    value: "project-management",
    count: "92 open positions",
    icon: Briefcase,
  },
];

export const EXPERIENCE_LEVELS = [
  {
    label: "Entry Level (0-2 yrs)",
    value: "0-2",
  },
  {
    label: "Mid Level (3-5 yrs)",
    value: "3-5",
  },
  {
    label: "Senior (5+ yrs)",
    value: "5+",
  },
];

export const IndustryType = [
  { label: "IT Solutions", value: "it_solutions" },
  { label: "IT Support and Services", value: "it_support_and_services" },
  { label: "IT with Agriculture", value: "it_with_agriculture" },
  { label: "Credit Card", value: "credit_card" },
  { label: "IT Hardware Sales", value: "it_hardware_sales" },
  {
    label: "IT Based Health Care Industry",
    value: "it_based_health_care_industry",
  },
  { label: "IT Software", value: "it_software" },
  {
    label: "IT Networking & Security Services",
    value: "it_networking_security_services",
  },
  { label: "IT Consumer Services", value: "it_consumer_services" },
  { label: "IT Infrastructure Service", value: "it_infrastructure_service" },
  {
    label: "IT and Security Solutions Provider",
    value: "it_and_security_solutions_provider",
  },
  { label: "IT Staffing", value: "it_staffing" },
  {
    label: "IT Hardware Support Services",
    value: "it_hardware_support_services",
  },
  { label: "IT Software Development", value: "it_software_development" },
  { label: "Managed IT Services", value: "managed_it_services" },
  {
    label: "IT Software & Health Services",
    value: "it_software_health_services",
  },
  { label: "Software Development", value: "software_development" },
  { label: "Software Solution", value: "software_solution" },
  { label: "Software Sales & Services", value: "software_sales_services" },
  { label: "Software Industry", value: "software_industry" },
  { label: "Real Estate", value: "real_estate" },
  {
    label: "Real Estate and Construction",
    value: "real_estate_and_construction",
  },
  { label: "Call Centre", value: "call_centre" },
  {
    label: "Wholesale and Retail Sales Counter",
    value: "wholesale_retail_sales_counter",
  },
  { label: "Sales & Service", value: "sales_service" },
  { label: "Sales or Marketing", value: "sales_or_marketing" },
  {
    label: "Education and Development of Children",
    value: "education_development_children",
  },
  { label: "Insurance Broking", value: "insurance_broking" },
  { label: "Insurance and Accounting", value: "insurance_accounting" },
  { label: "Insurance Broker", value: "insurance_broker" },
  { label: "Insurance Company", value: "insurance_company" },
  {
    label: "Information & Technology Services",
    value: "information_technology_services",
  },
  {
    label: "Information Technology - Software",
    value: "information_technology_software",
  },
  { label: "Technology Solutions", value: "technology_solutions" },
  { label: "Construction Service", value: "construction_service" },
  { label: "Construction & Services", value: "construction_services" },
  {
    label: "Sports Construction Company",
    value: "sports_construction_company",
  },
  { label: "Digital Agency", value: "digital_agency" },
  { label: "Digital Marketing", value: "digital_marketing" },
  {
    label: "Digital Marketing Institute",
    value: "digital_marketing_institute",
  },
  {
    label: "Digital Marketing & Media Company",
    value: "digital_marketing_media_company",
  },
  { label: "CA Firm & Tax Consultant Firm", value: "ca_firm_tax_consultant" },
  {
    label: "Hotel & Hospitality Industry",
    value: "hotel_hospitality_industry",
  },
  { label: "Hospitality Sector", value: "hospitality_sector" },
  { label: "Hospitality Services", value: "hospitality_services" },
  { label: "Tax and Financial Consultant", value: "tax_financial_consultant" },
  { label: "Financial Planning", value: "financial_planning" },
  { label: "Financial Services", value: "financial_services" },
  { label: "Financial & Tax Consultant", value: "financial_tax_consultant" },
  { label: "Financial Consultant", value: "financial_consultant" },
  { label: "Financial Banking", value: "financial_banking" },
  { label: "Financial Institution", value: "financial_institution" },
  { label: "Hotel and Restaurant", value: "hotel_restaurant" },
  { label: "Hotel Job Placement", value: "hotel_job_placement" },
  {
    label: "Industrial Products Distributorship",
    value: "industrial_products_distributorship",
  },
  {
    label: "Education Products & Services",
    value: "education_products_services",
  },
  {
    label: "Agricultural Products - Manufacturing and Marketing",
    value: "agricultural_products_manufacturing_marketing",
  },
  { label: "Chartered Accountant Firm", value: "chartered_accountant_firm" },
  { label: "Training Institute", value: "training_institute" },
  {
    label: "Training and Placement Company",
    value: "training_placement_company",
  },
  { label: "Web Design & Development", value: "web_design_development" },
  { label: "Design Studio", value: "design_studio" },
  { label: "Design and Construction", value: "design_construction" },
  { label: "Interior Design Studio", value: "interior_design_studio" },
  { label: "Management Consultants", value: "management_consultants" },
  { label: "Wealth Management Services", value: "wealth_management_services" },
  { label: "Travel & Tourism", value: "travel_tourism" },
  { label: "Travel Agency", value: "travel_agency" },
  { label: "Online Business", value: "online_business" },
  { label: "Online Shopping", value: "online_shopping" },
  { label: "Online Work", value: "online_work" },
  { label: "Online Services", value: "online_services" },
  { label: "Online Retail", value: "online_retail" },
  { label: "Online Jobs", value: "online_jobs" },
  { label: "Tax Consultant", value: "tax_consultant" },
  { label: "Interior Design", value: "interior_design" },
  { label: "Industrial Automation", value: "industrial_automation" },
  { label: "Industrial Sales", value: "industrial_sales" },
  { label: "Industrial Trading", value: "industrial_trading" },
  { label: "Logistics and Transportation", value: "logistics_transportation" },
  { label: "Logistics Services", value: "logistics_services" },
  { label: "Business Consulting", value: "business_consulting" },
  { label: "Retail Store Chain", value: "retail_store_chain" },
  { label: "Healthcare Industry", value: "healthcare_industry" },
  { label: "Engineering Industry", value: "engineering_industry" },
  { label: "Engineering Services", value: "engineering_services" },
  { label: "Web Services", value: "web_services" },
  { label: "Web Solution", value: "web_solution" },
  { label: "Web Development", value: "web_development" },
  { label: "Medical Laboratory", value: "medical_laboratory" },
  { label: "Medical Equipment", value: "medical_equipment" },
  { label: "Medical and Health Care", value: "medical_health_care" },
  { label: "Medical Store", value: "medical_store" },
  { label: "Coaching Institute", value: "coaching_institute" },
  {
    label: "Printing & Graphic Designing",
    value: "printing_graphic_designing",
  },
  {
    label: "Printing & Packaging Industry",
    value: "printing_packaging_industry",
  },
  { label: "Printing Industry", value: "printing_industry" },
  { label: "Printing Press", value: "printing_press" },
  { label: "FMCG Manufacturer", value: "fmcg_manufacturer" },
  { label: "FMCG Retail Sales", value: "fmcg_retail_sales" },
  { label: "Telecom Sector", value: "telecom_sector" },
  { label: "Water Purifier", value: "water_purifier" },
  { label: "Water Treatment", value: "water_treatment" },
  { label: "Event Planning", value: "event_planning" },
  { label: "Event Management", value: "event_management" },
  { label: "Wholesale Trading House", value: "wholesale_trading_house" },
  { label: "E Commerce", value: "e_commerce" },
  { label: "Service Industry", value: "service_industry" },
  { label: "Solar & Renewable Energy", value: "solar_renewable_energy" },
  { label: "Corporate Gifting", value: "corporate_gifting" },
  { label: "Furniture Manufacturing", value: "furniture_manufacturing" },
  { label: "Elderly Home Care", value: "elderly_home_care" },
  { label: "Service Provider", value: "service_provider" },
  {
    label: "Electrical Service and Trading",
    value: "electrical_service_trading",
  },
  { label: "Renewable Energy", value: "renewable_energy" },
  {
    label: "Mobile Accessories and Batteries",
    value: "mobile_accessories_batteries",
  },
  { label: "Life Insurance", value: "life_insurance" },
  { label: "Home Health Care", value: "home_health_care" },
  { label: "Mobile Electronics", value: "mobile_electronics" },
  { label: "Automobile Service", value: "automobile_service" },
  { label: "Internet Service Provider", value: "internet_service_provider" },
  { label: "Defence & Aerospace", value: "defence_aerospace" },
  { label: "Medicine Firm", value: "medicine_firm" },
  { label: "Automobile Retail", value: "automobile_retail" },
  { label: "Multicuisine Restaurant", value: "multicuisine_restaurant" },
  { label: "Home Tuition", value: "home_tuition" },
  { label: "Fire Safety", value: "fire_safety" },
  { label: "Fashion Industry", value: "fashion_industry" },
  { label: "Transport Company", value: "transport_company" },
  { label: "Transport and Services", value: "transport_services" },
  { label: "Packaging Industry", value: "packaging_industry" },
  { label: "Solar Business", value: "solar_business" },
  { label: "Pharmaceutical Industry", value: "pharmaceutical_industry" },
  { label: "NGO Office", value: "ngo_office" },
  { label: "Jewellery Manufacturing", value: "jewellery_manufacturing" },
  { label: "Garment Shop", value: "garment_shop" },
  { label: "Laundry Service", value: "laundry_service" },
  { label: "Fitness Studio", value: "fitness_studio" },
  { label: "Fitness Equipment", value: "fitness_equipment" },
  { label: "Other", value: "other" },
];

export const BENEFITS = [
  { label: "Health Insurance", value: "health_insurance" },
  { label: "Provident Fund (PF)", value: "provident_fund" },
  { label: "Paid Leaves", value: "paid_leaves" },
  { label: "Flexible Work Hours", value: "flexible_work_hours" },
  { label: "Sales Incentives", value: "sales_incentives" },
  { label: "Annual Bonus", value: "annual_bonus" },
  { label: "Joining Bonus", value: "joining_bonus" },
  { label: "Travel Allowance", value: "travel_allowance" },
  { label: "Company Cab / Shuttle", value: "company_cab_shuttle" },
  { label: "Shift Allowance", value: "shift_allowance" },
  { label: "Weekly Payout", value: "weekly_payout" },
  { label: "Lunch / Dinner", value: "lunch_dinner" },
  { label: "Staff Accommodation", value: "staff_accommodation" },
  { label: "Petrol Allowance", value: "petrol_allowance" },
  { label: "Mobile Allowance", value: "mobile_allowance" },
  { label: "Tea / Coffee", value: "tea_coffee" },
];

export const JOB_ROLES_CATEGORY_TYPE = [
  {
    label: "Banking, Financial Services & Insurance",
    value: "banking_financial_services_insurance",
    roles: [
      { label: "Banking Operations", value: "banking_operations" },
      { label: "Collections / Recovery", value: "collections_recovery" },
      { label: "Insurance", value: "insurance" },
      { label: "Lending Operations", value: "lending_operations" },
      {
        label: "Trading Management",
        value: "trading_management",
      },
      {
        label: "Asset Management",
        value: "asset_management",
      },
      {
        label: "Wealth Management",
        value: "wealth_management",
      },
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
      {
        label: "Content Writing and Editing",
        value: "content_writing_editing",
      },
      { label: "Journalism", value: "journalism" },
    ],
  },

  {
    label: "Customer Support",
    value: "customer_support",
    roles: [
      {
        label: "Customer Success / Account Handling",
        value: "customer_success_account_handling",
      },
      {
        label: "International Telecalling",
        value: "international_telecalling",
      },
      { label: "Non Voice / Chat", value: "non_voice_chat" },
      {
        label: "Team Leader / Management / Operations",
        value: "team_leader_management_operations",
      },
      { label: "Telecalling / BPO", value: "telecalling_bpo" },
      { label: "Telesales", value: "telesales" },
    ],
  },

  {
    label: "Data Science & Analytics",
    value: "data_science_analytics",
    roles: [
      {
        label: "Business Intelligence & Analytics",
        value: "business_intelligence_analytics",
      },
      {
        label: "Data Science & Machine Learning",
        value: "data_science_machine_learning",
      },
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
      {
        label: "Architecture & Interior Design",
        value: "architecture_interior_design",
      },
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
      {
        label: "Payables / Receivables Management",
        value: "payables_receivables_management",
      },
      {
        label: "Payroll & Transactions",
        value: "payroll_transactions",
      },
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
      {
        label: "Baby Care / Caretaker / Elder Care",
        value: "baby_care_caretaker_elder_care",
      },
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
      {
        label: "HR Operations / Employee Relations",
        value: "hr_operations_employee_relations",
      },
      {
        label: "Recruitment & Talent Acquisition",
        value: "recruitment_talent_acquisition",
      },
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
      {
        label: "Market Research & Insights",
        value: "market_research_insights",
      },
      { label: "Marketing", value: "marketing" },
    ],
  },

  {
    label: "Media Production & Entertainment",
    value: "media_production_entertainment",
    roles: [
      { label: "Animation / Effects", value: "animation_effects" },
      {
        label: "Direction / Production / Artists",
        value: "direction_production_artists",
      },
      { label: "Make Up / Costume", value: "make_up_costume" },
      {
        label: "Photographer / Videographer",
        value: "photographer_videographer",
      },
    ],
  },

  {
    label: "Office / Admin / Computer Operator",
    value: "office_admin_computer_operator",
    roles: [
      { label: "Administration", value: "administration" },
      { label: "Back Office", value: "back_office" },
      {
        label: "Data Entry/Computer Operator",
        value: "data_entry_computer_operator",
      },
      {
        label: "Facility / Property Management",
        value: "facility_property_management",
      },
      {
        label: "Front Office / Receptionist",
        value: "front_office_receptionist",
      },
      { label: "Office Help / Peon", value: "office_help_peon" },
    ],
  },

  {
    label: "Operations",
    value: "operations",
    roles: [
      { label: "Ecommerce Operations", value: "ecommerce_operations" },
      { label: "Logistics Operations", value: "logistics_operations" },
      {
        label: "Manufacturing/Production",
        value: "manufacturing_production",
      },
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
      {
        label: "Manufacturing/Production Quality",
        value: "manufacturing_production_quality",
      },
    ],
  },

  {
    label: "Purchase & Supply Chain",
    value: "purchase_supply_chain",
    roles: [
      { label: "Import & Export", value: "import_export" },
      { label: "Procurement & Purchase", value: "procurement_purchase" },
      { label: "Quality Management", value: "quality_management" },
      {
        label: "Stores & Material Management",
        value: "stores_material_management",
      },
      { label: "Warehousing", value: "warehousing" },
    ],
  },

  {
    label: "Restaurant / Hospitality / Tourism",
    value: "restaurant_hospitality_tourism",
    roles: [
      { label: "Event Management", value: "event_management" },
      {
        label: "Front Office & Guest Services",
        value: "front_office_guest_services",
      },
      {
        label: "Front Office / Receptionist",
        value: "front_office_receptionist",
      },
      { label: "Hospitality Management", value: "hospitality_management" },
      { label: "Hotel Cook / Chef", value: "hotel_cook_chef" },
      {
        label: "Housekeeping & Laundry",
        value: "housekeeping_laundry",
      },
      {
        label: "Restaurant Staff / Waiter / Kitchen Help",
        value: "restaurant_staff_waiter_kitchen_help",
      },
      {
        label: "Travel / Tourism Services",
        value: "travel_tourism_services",
      },
    ],
  },

  {
    label: "Sales & Business Development",
    value: "sales_business_development",
    roles: [
      {
        label: "Business Development / Lead Generation",
        value: "business_development_lead_generation",
      },
      {
        label: "Enterprise & B2B Sales",
        value: "enterprise_b2b_sales",
      },
      { label: "Field Sales", value: "field_sales" },
      { label: "Inside Sales", value: "inside_sales" },
      {
        label: "Retail / Counter Sales / B2C",
        value: "retail_counter_sales_b2c",
      },
      { label: "Sales Management", value: "sales_management" },
      {
        label: "Sales Support & Operations",
        value: "sales_support_operations",
      },
      {
        label: "Stores & Material Management",
        value: "stores_material_management",
      },
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
      {
        label: "DBA / Data warehousing",
        value: "dba_data_warehousing",
      },
      { label: "DevOps", value: "devops" },
      { label: "Frontend Development", value: "frontend_development" },
      {
        label: "Full Stack Development",
        value: "full_stack_development",
      },
      {
        label: "IT & Information Security",
        value: "it_information_security",
      },
      { label: "Project Management", value: "project_management" },
      {
        label: "Quality Assurance and Testing",
        value: "quality_assurance_testing",
      },
      { label: "Software Development", value: "software_development" },
    ],
  },

  {
    label: "Sports, Health & Fitness",
    value: "sports_health_fitness",
    roles: [
      { label: "Gym/Fitness trainer", value: "gym_fitness_trainer" },
      { label: "Nutritionist", value: "nutritionist" },
      {
        label: "Sports Science & Medicine",
        value: "sports_science_medicine",
      },
      {
        label: "Sports Staff and Management",
        value: "sports_staff_management",
      },
      { label: "Yoga trainer", value: "yoga_trainer" },
    ],
  },

  {
    label: "Teaching & Training",
    value: "teaching_training",
    roles: [
      {
        label: "Administration & Staff",
        value: "administration_staff",
      },
      { label: "Corporate Training", value: "corporate_training" },
      { label: "Counsellor", value: "counsellor" },
      {
        label: "Extra Curricular Activity",
        value: "extra_curricular_activity",
      },
      { label: "Language Teacher", value: "language_teacher" },
      {
        label: "Preschool & Primary Education",
        value: "preschool_primary_education",
      },
      {
        label: "Subject / Specialization Teacher",
        value: "subject_specialization_teacher",
      },
      {
        label: "University Level Educator",
        value: "university_level_educator",
      },
    ],
  },

  {
    label: "Technician / Vehicle Service",
    value: "technician_vehicle_service",
    roles: [
      {
        label: "AC / Refrigeration / HVAC / Aquaguard",
        value: "ac_refrigeration_hvac_aquaguard",
      },
      {
        label: "Carpentry and Woodworking",
        value: "carpentry_woodworking",
      },
      { label: "Electrical", value: "electrical" },
      { label: "Electronics", value: "electronics" },
      {
        label: "Elevator and Lift Maintenance",
        value: "elevator_lift_maintenance",
      },
      { label: "Factory Worker", value: "factory_worker" },
      { label: "Fitter / Welder", value: "fitter_welder" },
      {
        label: "Jewelry Design and Decoration",
        value: "jewelry_design_decoration",
      },
      { label: "Machine Operator", value: "machine_operator" },
      { label: "Painter", value: "painter" },
      { label: "Pest Control", value: "pest_control" },
      { label: "Plumber", value: "plumber" },
      {
        label: "Security / Fire / Safety",
        value: "security_fire_safety",
      },
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
