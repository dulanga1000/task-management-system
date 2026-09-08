import mongoose, {Document,Schema} from "mongoose";

export interface IRefreshToken extends Document {
  user: mongoose.Types.ObjectId;
  tokenHash: string;
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
      },

      tokenHash: {
        type: String,
        required: true,
        unique: true,
      },

      expiresAt: {
        type: Date,
        required: true,
      },

      revokedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

const RefreshToken =
  mongoose.model<IRefreshToken>(
    "RefreshToken",
    refreshTokenSchema
  );

export default RefreshToken;