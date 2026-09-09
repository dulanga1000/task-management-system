import mongoose, { Document, Schema } from "mongoose";
import { USER_ROLES, type UserRole } from "../constants/roles.js";

export interface IProfilePicture {
  storageKey: string;
  mimeType: string;
  size: number;
  updatedAt: Date;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  profilePicture?: IProfilePicture | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },

    profilePicture: {
      type: {
        storageKey: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        updatedAt: { type: Date, default: Date.now },
      },
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ createdAt: -1 });

const User = mongoose.model<IUser>("User", userSchema);

export default User;