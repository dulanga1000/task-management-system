import mongoose, { Document, Schema } from "mongoose";

export type AttachmentType = "IMAGE" | "PDF";

export interface IAttachment extends Document {
  task: mongoose.Types.ObjectId;
  originalName: string;
  storageKey: string;
  bucket: string;
  mimeType: string;
  size: number;
  type: AttachmentType;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new Schema<IAttachment>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    storageKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bucket: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      enum: ["IMAGE", "PDF"],
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

attachmentSchema.index({ task: 1, createdAt: -1 });

const Attachment = mongoose.model<IAttachment>("Attachment", attachmentSchema);

export default Attachment;
