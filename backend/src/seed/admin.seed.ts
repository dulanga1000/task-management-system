import { connectDatabase } from "../config/database.js";
import { env } from "../config/env.js";
import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";
import { USER_ROLES } from "../constants/roles.js";

const seedAdmin = async (): Promise<void> => {
  try {
    await connectDatabase();

    const existingAdmin = await User.findOne({
      email: env.admin.email.toLowerCase(),
    });

    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    const hashedPassword = await hashPassword(
      env.admin.password
    );

    const admin = await User.create({
      firstName: env.admin.firstName,
      lastName: env.admin.lastName,
      username: env.admin.username.toLowerCase(),
      email: env.admin.email.toLowerCase(),
      password: hashedPassword,
      role: USER_ROLES.ADMIN,
    });

    console.log("Admin user created successfully.");
    console.log(`Admin email: ${admin.email}`);
  } catch (error) {
    console.error("Failed to seed admin:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

seedAdmin();