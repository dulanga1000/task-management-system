import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { UserRole } from "../constants/roles.js";

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export const generateToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as NonNullable<
      SignOptions["expiresIn"]
    >,
  });
};

export const verifyToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    env.jwtSecret
  ) as JwtPayload;
};