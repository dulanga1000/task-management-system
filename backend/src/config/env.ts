import "dotenv/config";

const requiredEnv = [
  "MONGODB_URI",
  "JWT_SECRET",
  "ADMIN_FIRST_NAME",
  "ADMIN_LAST_NAME",
  "ADMIN_USERNAME",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
] as const;

for (const env of requiredEnv) {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  admin: {
  firstName: process.env.ADMIN_FIRST_NAME as string,
  lastName: process.env.ADMIN_LAST_NAME as string,
  username: process.env.ADMIN_USERNAME as string,
  email: process.env.ADMIN_EMAIL as string,
  password: process.env.ADMIN_PASSWORD as string,
},
};
