import mongoose, { Document, Schema } from "mongoose";

export interface IRefreshToken extends Document {
  user: mongoose.Types.ObjectId;
  tokenHash: string;
  familyId: string;
  replacedBy: mongoose.Types.ObjectId | null;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSchema =
  new Schema<IRefreshToken>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      tokenHash: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      familyId: {
        type: String,
        required: true,
        index: true,
      },

      replacedBy: {
        type: Schema.Types.ObjectId,
        ref: "RefreshToken",
        default: null,
      },

      expiresAt: {
        type: Date,
        required: true,
        index: true,
      },

      revokedAt: {
        type: Date,
        default: null,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

// Automatically remove expired refresh tokens.
refreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const RefreshToken =
  mongoose.model<IRefreshToken>(
    "RefreshToken",
    refreshTokenSchema
  );

export default RefreshToken;