import User, { type IUser } from "../models/User.js";
import Task from "../models/Task.js";
import { USER_ROLES } from "../constants/roles.js";
import { AppError } from "../utils/app-error.js";
import { validateObjectId } from "../utils/validate-object-id.js";
import {
  parsePaginationParams,
  buildPaginationMeta,
} from "../utils/pagination.js";
import type {
  PaginationParams,
  PaginationMeta,
} from "../types/pagination.js";
import type {
  UpdateUserInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from "../validations/user.validation.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  uploadToStorage,
  deleteFromStorage,
  generateProfilePictureKey,
  getPresignedFileUrl,
} from "../utils/storage.js";

export interface GetUsersResult {
  users: Omit<IUser, "password">[];
  pagination: PaginationMeta;
}

/**
 * Helper to populate user's profile picture with a short-lived presigned URL
 */
export const populateProfilePictureUrl = async (userDoc: any) => {
  if (!userDoc) return null;
  const user = typeof userDoc.toObject === "function" ? userDoc.toObject() : { ...userDoc };

  if (user.profilePicture?.storageKey) {
    try {
      const url = await getPresignedFileUrl(user.profilePicture.storageKey, 3600);
      user.profilePicture = {
        ...user.profilePicture,
        url,
      };
    } catch (err) {
      console.error("Failed to generate presigned URL for user profile picture:", err);
    }
  } else {
    user.profilePicture = null;
  }

  return user;
};

// Get all users with server-side pagination
export const getUsers = async (
  params: PaginationParams = {}
): Promise<GetUsersResult> => {
  const { page, limit, skip } = parsePaginationParams(params);

  const [rawUsers, totalItems] = await Promise.all([
    User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(),
  ]);

  const users = await Promise.all(rawUsers.map((u) => populateProfilePictureUrl(u)));
  const pagination = buildPaginationMeta(totalItems, page, limit);

  return {
    users: users as unknown as Omit<IUser, "password">[],
    pagination,
  };
};

// Get a user by ID
export const getUserById = async (userId: string) => {
  validateObjectId(userId, "user ID");

  const user = await User.findById(userId).select("-password").lean();
  return populateProfilePictureUrl(user);
};

// Update a normal user's details (Admin only)
export const updateUser = async (
  userId: string,
  data: UpdateUserInput
) => {
  validateObjectId(userId, "user ID");

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Prevent modifying administrator accounts through this endpoint
  if (user.role === USER_ROLES.ADMIN) {
    throw new AppError(
      "Administrators cannot be modified through this interface",
      403
    );
  }

  // Check unique username if changing
  if (
    data.username &&
    data.username.toLowerCase() !== user.username.toLowerCase()
  ) {
    const existingUsername = await User.findOne({
      username: { $regex: new RegExp(`^${data.username}$`, "i") },
      _id: { $ne: userId },
    });

    if (existingUsername) {
      throw new AppError("Username is already in use", 409);
    }

    user.username = data.username;
  }

  // Check unique email if changing
  if (
    data.email &&
    data.email.toLowerCase() !== user.email.toLowerCase()
  ) {
    const existingEmail = await User.findOne({
      email: data.email.toLowerCase(),
      _id: { $ne: userId },
    });

    if (existingEmail) {
      throw new AppError("Email is already registered", 409);
    }

    user.email = data.email.toLowerCase();
  }

  if (data.firstName !== undefined) {
    user.firstName = data.firstName;
  }

  if (data.lastName !== undefined) {
    user.lastName = data.lastName;
  }

  await user.save();

  const updated = await User.findById(userId).select("-password").lean();
  return populateProfilePictureUrl(updated);
};

// Delete a normal user account and unassign their tasks (Admin only)
export const deleteUser = async (
  userId: string,
  requestingAdminId: string
) => {
  validateObjectId(userId, "user ID");

  // Prevent requesting Admin from deleting themselves
  if (userId === requestingAdminId) {
    throw new AppError("You cannot delete your own account", 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Prevent deleting another Administrator
  if (user.role === USER_ROLES.ADMIN) {
    throw new AppError("You cannot delete an administrator", 403);
  }

  // Delete profile picture from Supabase if exists
  if (user.profilePicture?.storageKey) {
    try {
      await deleteFromStorage(user.profilePicture.storageKey);
    } catch (cleanupError) {
      console.warn("Failed to delete user profile picture from storage:", cleanupError);
    }
  }

  // Unassign all tasks assigned to this user without deleting the tasks
  await Task.updateMany(
    { assignedUser: userId },
    { $set: { assignedUser: null } }
  );

  // Delete the user record
  await User.findByIdAndDelete(userId);

  return true;
};

// Update own profile
export const updateProfile = async (
  userId: string,
  data: UpdateProfileInput
) => {
  validateObjectId(userId, "user ID");

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Check unique username if changing
  if (
    data.username &&
    data.username.toLowerCase() !== user.username.toLowerCase()
  ) {
    const existingUsername = await User.findOne({
      username: { $regex: new RegExp(`^${data.username}$`, "i") },
      _id: { $ne: userId },
    });

    if (existingUsername) {
      throw new AppError("Username is already in use", 409);
    }

    user.username = data.username;
  }

  // Check unique email if changing
  if (
    data.email &&
    data.email.toLowerCase() !== user.email.toLowerCase()
  ) {
    const existingEmail = await User.findOne({
      email: data.email.toLowerCase(),
      _id: { $ne: userId },
    });

    if (existingEmail) {
      throw new AppError("Email is already registered", 409);
    }

    user.email = data.email.toLowerCase();
  }

  if (data.firstName !== undefined) {
    user.firstName = data.firstName;
  }

  if (data.lastName !== undefined) {
    user.lastName = data.lastName;
  }

  await user.save();

  const updated = await User.findById(userId).select("-password").lean();
  return populateProfilePictureUrl(updated);
};

// Change own password
export const changePassword = async (
  userId: string,
  data: ChangePasswordInput
) => {
  validateObjectId(userId, "user ID");

  // Fetch user including the password hash
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Verify current password
  const isMatch = await comparePassword(data.currentPassword, user.password);
  if (!isMatch) {
    throw new AppError("Current password is incorrect", 400);
  }

  // Ensure new password is not the same as current password
  const isSame = await comparePassword(data.newPassword, user.password);
  if (isSame) {
    throw new AppError(
      "New password cannot be the same as the current password",
      400
    );
  }

  // Hash new password and save
  user.password = await hashPassword(data.newPassword);
  await user.save();

  return { message: "Password changed successfully" };
};

// Upload or replace authenticated user's profile picture
export const uploadUserProfilePicture = async (
  userId: string,
  file: Express.Multer.File
) => {
  validateObjectId(userId, "user ID");

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const oldStorageKey = user.profilePicture?.storageKey;
  const storageKey = generateProfilePictureKey(userId, file.originalname);
  const mimeType = file.mimetype.toLowerCase();

  // 1. Upload new image to Supabase Storage
  await uploadToStorage(storageKey, file.buffer, mimeType);

  // 2. Update user profilePicture in MongoDB with compensating rollback
  user.profilePicture = {
    storageKey,
    mimeType,
    size: file.size,
    updatedAt: new Date(),
  };

  try {
    await user.save();
  } catch (dbError) {
    // Compensating rollback: delete uploaded object from storage
    try {
      await deleteFromStorage(storageKey);
    } catch (cleanupError) {
      console.error("Rollback cleanup error:", cleanupError);
    }
    throw dbError;
  }

  // 3. Delete old object from Supabase if replacement
  if (oldStorageKey) {
    try {
      await deleteFromStorage(oldStorageKey);
    } catch (cleanupError) {
      console.warn("Failed to delete old profile picture from storage:", cleanupError);
    }
  }

  // 4. Return populated user with presigned URL
  const updated = await User.findById(userId).select("-password").lean();
  return populateProfilePictureUrl(updated);
};

// Delete authenticated user's profile picture
export const deleteUserProfilePicture = async (userId: string) => {
  validateObjectId(userId, "user ID");

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.profilePicture?.storageKey) {
    throw new AppError("Profile picture not found", 404);
  }

  const storageKey = user.profilePicture.storageKey;

  // 1. Delete object from Supabase Storage
  await deleteFromStorage(storageKey);

  // 2. Clear profilePicture in MongoDB
  user.profilePicture = null;
  await user.save();

  // 3. Return updated user
  const updated = await User.findById(userId).select("-password").lean();
  return populateProfilePictureUrl(updated);
};