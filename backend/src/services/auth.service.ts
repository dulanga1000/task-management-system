import crypto from "crypto";
import mongoose from "mongoose";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import type { RegisterInput, LoginInput } from "../validations/auth.validation.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { AppError } from "../utils/app-error.js";
import { validateObjectId } from "../utils/validate-object-id.js";
import { env } from "../config/env.js";
import { getPresignedFileUrl } from "../utils/storage.js";

// REFRESH TOKEN HASHING

const hashRefreshToken = (
  token: string
): string => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

// REFRESH TOKEN EXPIRY

const getRefreshTokenExpiry = (): Date => {
  const expiresIn =
    env.jwtRefreshExpiresIn;

  const match =
    expiresIn.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(
      "Invalid JWT_REFRESH_EXPIRES_IN format"
    );
  }

  const value = Number(match[1]);
  const unit = match[2];

  const milliseconds = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }[unit as "s" | "m" | "h" | "d"];

  return new Date(
    Date.now() + value * milliseconds
  );
};

// GRACE PERIOD

/*
 * How long a just-rotated token is still
 * accepted from concurrent requests that
 * already held the old token.
 */
const GRACE_PERIOD_MS = 30 * 1000;

// REGISTER

export const registerUser = async (
  data: RegisterInput
) => {
  const username =
    data.username.toLowerCase();

  const email =
    data.email.toLowerCase();

  const existingUsername =
    await User.findOne({
      username,
    });

  if (existingUsername) {
    throw new AppError(
      "Username is already taken",
      409
    );
  }

  const existingUser =
    await User.findOne({
      email,
    });

  if (existingUser) {
    throw new AppError(
      "Email is already registered",
      409
    );
  }

  const hashedPassword =
    await hashPassword(data.password);

  const user = await User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    username,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// LOGIN

export const loginUser = async (
  data: LoginInput
) => {
  const email =
    data.email.toLowerCase();

  const user =
    await User.findOne({
      email,
    }).select("+password");

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const passwordValid =
    await comparePassword(
      data.password,
      user.password
    );

  if (!passwordValid) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const payload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const accessToken =
    generateAccessToken(payload);

  const refreshToken =
    generateRefreshToken(payload);

  const tokenHash =
    hashRefreshToken(refreshToken);

  await RefreshToken.create({
    user: user._id,
    tokenHash,
    familyId:
      new mongoose.Types.ObjectId().toString(),
    expiresAt:
      getRefreshTokenExpiry(),
  });

  let profilePicture = null;
  if (user.profilePicture?.storageKey) {
    try {
      const url = await getPresignedFileUrl(
        user.profilePicture.storageKey,
        env.supabase.signedUrlExpiresIn
      );
      profilePicture = {
        storageKey: user.profilePicture.storageKey,
        mimeType: user.profilePicture.mimeType,
        size: user.profilePicture.size,
        updatedAt: user.profilePicture.updatedAt,
        url,
      };
    } catch {
      console.warn("Failed to generate signed URL for profile picture");
    }
  }

  return {
    user: {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture,
    },

    accessToken,

    // Controller puts this into HttpOnly cookie.
    refreshToken,
  };
};

// REFRESH ACCESS TOKEN

export const refreshAccessToken = async (
  refreshToken: string | undefined
) => {
  if (!refreshToken) {
    throw new AppError(
      "Refresh token is required",
      401
    );
  }

  // VERIFY JWT SIGNATURE

  let payload;

  try {
    payload =
      verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(
      "Invalid or expired refresh token",
      401
    );
  }

  // VALIDATE USER ID

  validateObjectId(
    payload.userId,
    "user ID"
  );

  // FIND TOKEN IN DB

  const tokenHash =
    hashRefreshToken(refreshToken);

  const storedToken =
    await RefreshToken.findOne({
      tokenHash,
    });

  if (!storedToken) {
    throw new AppError(
      "Invalid or expired refresh token",
      401
    );
  }


  // CASE 1: TOKEN ALREADY REVOKED
  //
  // Could be a concurrent legitimate request
  // that lost the atomic race, or a genuine
  // replay attack.


  if (storedToken.revokedAt) {
    /*
     * No replacedBy means this token was revoked
     * without rotation (e.g. logout) or is a
     * genuine replay attack.
     */
    if (!storedToken.replacedBy) {
      throw new AppError(
        "Refresh token has been revoked",
        401
      );
    }


    // Check grace window.

    const revokedAgo =
      Date.now() -
      storedToken.revokedAt.getTime();

    if (revokedAgo > GRACE_PERIOD_MS) {
      throw new AppError(
        "Refresh token reuse detected",
        401
      );
    }

    // Load the replacement token (R2).

    const replacementToken =
      await RefreshToken.findById(
        storedToken.replacedBy
      );

    if (!replacementToken) {
      throw new AppError(
        "Invalid refresh token",
        401
      );
    }

    if (replacementToken.revokedAt) {
      throw new AppError(
        "Refresh token has been revoked",
        401
      );
    }

    if (
      replacementToken.expiresAt.getTime() <=
      Date.now()
    ) {
      throw new AppError(
        "Refresh token has expired",
        401
      );
    }

    // User must still exist.

    const user =
      await User.findById(
        payload.userId
      );

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    /*
     * Grace-window hit: return a fresh access
     * token without touching the cookie.
     * The browser already received R2 from
     * the winning concurrent request.
     */
    const accessToken =
      generateAccessToken({
        userId: user._id.toString(),
        role: user.role,
      });

    return {
      accessToken,
    };
  }

  // CASE 2: TOKEN IS ACTIVE — validate then rotate

  // Expiry check before opening a transaction.

  if (
    storedToken.expiresAt.getTime() <=
    Date.now()
  ) {
    await RefreshToken.findByIdAndUpdate(
      storedToken._id,
      {
        revokedAt: new Date(),
      }
    );

    throw new AppError(
      "Refresh token has expired",
      401
    );
  }

  // User must still exist before we rotate.

  const user =
    await User.findById(
      payload.userId
    );

  if (!user) {
    await RefreshToken.findByIdAndUpdate(
      storedToken._id,
      {
        revokedAt: new Date(),
      }
    );

    throw new AppError(
      "User not found",
      404
    );
  }

  // ATOMIC ROTATION (MongoDB transaction)
  //
  // Only ONE concurrent request can win the
  // atomic claim. The loser falls through to
  // the grace-window path.

  const session =
    await mongoose.startSession();

  try {
    session.startTransaction();

    const now = new Date();

    /*
     * Atomic claim: match revokedAt: null so
     * only the first concurrent request succeeds.
     */
    const claimedToken =
      await RefreshToken.findOneAndUpdate(
        {
          _id: storedToken._id,
          revokedAt: null,
        },
        {
          $set: {
            revokedAt: now,
          },
        },
        {
          new: false,
          session,
        }
      );

    /*
     * This request lost the race — another
     * concurrent request already revoked R1.
     * Poll briefly for the winner to link R2.
     */
    if (!claimedToken) {
      await session.abortTransaction();

      let latestToken = null;

      for (
        let attempt = 0;
        attempt < 2;
        attempt++
      ) {
        latestToken =
          await RefreshToken.findById(
            storedToken._id
          );

        if (latestToken?.replacedBy) {
          break;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 50)
        );
      }

      if (
        !latestToken ||
        !latestToken.revokedAt ||
        !latestToken.replacedBy
      ) {
        throw new AppError(
          "Refresh token rotation failed",
          401
        );
      }

      const revokedAgo =
        Date.now() -
        latestToken.revokedAt.getTime();

      if (revokedAgo > GRACE_PERIOD_MS) {
        throw new AppError(
          "Refresh token reuse detected",
          401
        );
      }

      const replacementToken =
        await RefreshToken.findById(
          latestToken.replacedBy
        );

      if (
        !replacementToken ||
        replacementToken.revokedAt
      ) {
        throw new AppError(
          "Invalid refresh token",
          401
        );
      }

      if (
        replacementToken.expiresAt.getTime() <=
        Date.now()
      ) {
        throw new AppError(
          "Refresh token has expired",
          401
        );
      }

      /*
       * Grace-window access token — no cookie update.
       */
      const accessToken =
        generateAccessToken({
          userId: user._id.toString(),
          role: user.role,
        });

      return {
        accessToken,
      };
    }

    // WON THE RACE — create R2 and link R1 → R2

    const newRefreshToken =
      generateRefreshToken({
        userId: user._id.toString(),
        role: user.role,
      });

    const newTokenHash =
      hashRefreshToken(newRefreshToken);

    // Create R2 inside the transaction.

    const newTokenDocs =
      await RefreshToken.create(
        [
          {
            user: user._id,
            tokenHash: newTokenHash,
            familyId: storedToken.familyId,
            replacedBy: null,
            expiresAt:
              getRefreshTokenExpiry(),
          },
        ],
        {
          session,
        }
      );

    // Link R1 → R2 so grace-window requests
    // can find the replacement.

    await RefreshToken.findByIdAndUpdate(
      storedToken._id,
      {
        replacedBy: newTokenDocs[0]!._id,
      },
      {
        session,
      }
    );

    await session.commitTransaction();

    const accessToken =
      generateAccessToken({
        userId: user._id.toString(),
        role: user.role,
      });

    return {
      accessToken,

      /*
       * Controller sets a new HttpOnly cookie
       * only when this field is present.
       */
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

// CURRENT USER

export const getCurrentUser = async (
  userId: string
) => {
  validateObjectId(
    userId,
    "user ID"
  );

  const user =
    await User.findById(userId);

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  let profilePicture = null;
  if (user.profilePicture?.storageKey) {
    try {
      const url = await getPresignedFileUrl(
        user.profilePicture.storageKey,
        env.supabase.signedUrlExpiresIn
      );
      profilePicture = {
        storageKey: user.profilePicture.storageKey,
        mimeType: user.profilePicture.mimeType,
        size: user.profilePicture.size,
        updatedAt: user.profilePicture.updatedAt,
        url,
      };
    } catch {
      console.warn("Failed to generate signed URL for profile picture");
    }
  }

  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    role: user.role,
    profilePicture,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// LOGOUT

export const logoutUser = async (
  refreshToken: string | undefined
): Promise<void> => {
  if (!refreshToken) {
    return;
  }

  const tokenHash =
    hashRefreshToken(refreshToken);

  await RefreshToken.findOneAndUpdate(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      revokedAt: new Date(),
    }
  );
};