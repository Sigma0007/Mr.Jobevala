import dotenv from "dotenv";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

await connectDB();


const createAdmin = async () => {
    try {
        const existingAdmin =
            await User.findOne({
                email: "admin@gmail.com",
            });

        if (existingAdmin) {
            console.log(
                "Admin already exists"
            );

            process.exit();
        }

        await User.create({
            name: "Super Admin",

            email:
                "admin@gmail.com",

            password: "Admin@123",

            role: "admin",
        });

        console.log(
            "Admin created successfully"
        );

        process.exit();
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
};

createAdmin();