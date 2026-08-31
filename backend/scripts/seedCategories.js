import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";

dotenv.config();

await connectDB();

const CATEGORIES = [
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

const seedCategories = async () => {
    try {
        console.log("Seeding categories...");

        for (const cat of CATEGORIES) {
            await Category.findOneAndUpdate(
                { value: cat.value },
                { $set: { title: cat.title, value: cat.value } },
                { upsert: true, new: true }
            );
        }

        console.log("Categories seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding categories:", error);
        process.exit(1);
    }
};

seedCategories();
