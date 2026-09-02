import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import { DEFAULT_CATEGORIES } from "../controllers/categoryController.js";

dotenv.config();

await connectDB();

const seedCategories = async () => {
    try {
        console.log("Seeding categories...");

        const validValues = DEFAULT_CATEGORIES.map((c) => c.value);

        // Optional: Remove obsolete categories not in the new category list
        const removed = await Category.deleteMany({ value: { $nin: validValues } });
        if (removed.deletedCount > 0) {
            console.log(`Cleaned up ${removed.deletedCount} old/deprecated categories.`);
        }

        for (const cat of DEFAULT_CATEGORIES) {
            await Category.findOneAndUpdate(
                { value: cat.value },
                {
                    $set: {
                        label: cat.label,
                        title: cat.title,
                        value: cat.value,
                        roles: cat.roles,
                    },
                },
                { upsert: true, new: true }
            );
        }

        console.log(`Successfully seeded/updated ${DEFAULT_CATEGORIES.length} categories with roles!`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding categories:", error);
        process.exit(1);
    }
};

seedCategories();
