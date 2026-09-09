import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { UserRole } from "../constants/roles.js";

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export const generateAccessToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(
    payload,
    env.jwtAccessSecret,
    {
      expiresIn:
        env.jwtAccessExpiresIn as NonNullable<
          SignOptions["expiresIn"]
        >,
    }
  );
};

export const generateRefreshToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(
    payload,
    env.jwtRefreshSecret,
    {
      expiresIn:
        env.jwtRefreshExpiresIn as NonNullable<
          SignOptions["expiresIn"]
        >,
    }
  );
};

export const verifyAccessToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    env.jwtAccessSecret
  ) as JwtPayload;
};

export const verifyRefreshToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    env.jwtRefreshSecret
  ) as JwtPayload;
};