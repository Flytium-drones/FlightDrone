import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const requiredEnvVars = ["MONGO_URI"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const adminConfig = {
  name: process.env.ADMIN_NAME || "FlightDrone Admin",
  email: process.env.ADMIN_EMAIL || "admin@flightdrone.com",
  phone: process.env.ADMIN_PHONE || "9236993440",
  address: process.env.ADMIN_ADDRESS || `Flytium Drones
H. N0 - 49C Near Paidleganj,Gorakhpur, Uttar Pradesh
India`,
  password: process.env.ADMIN_PASSWORD || "Admin@123",
  answer: process.env.ADMIN_SECURITY_ANSWER || "flightdrone",
};

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    const existingUser = await User.findOne({ email: adminConfig.email });

    if (existingUser) {
      const needsPasswordUpdate = !(await bcrypt.compare(
        adminConfig.password,
        existingUser.password
      ));

      existingUser.name = adminConfig.name;
      existingUser.phone = adminConfig.phone;
      existingUser.address = adminConfig.address;
      existingUser.answer = adminConfig.answer;
      existingUser.role = 1;

      if (needsPasswordUpdate) {
        existingUser.password = await bcrypt.hash(adminConfig.password, 10);
      }

      await existingUser.save();
      console.log(
        `Admin user already existed. Details refreshed for ${existingUser.email}`
      );
    } else {
      const hashedPassword = await bcrypt.hash(adminConfig.password, 10);

      await User.create({
        name: adminConfig.name,
        email: adminConfig.email,
        phone: adminConfig.phone,
        address: adminConfig.address,
        password: hashedPassword,
        role: 1,
        answer: adminConfig.answer,
      });

      console.log(`Admin user created with email ${adminConfig.email}`);
    }

    console.log(
      "Seeding complete. Remember to change default credentials in production."
    );
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin user:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedAdmin();
