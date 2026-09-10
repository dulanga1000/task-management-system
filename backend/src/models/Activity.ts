import mongoose, { Document, Schema } from "mongoose";

export type ActivityType =
  | "TASK_CREATED"
  | "STATUS_CHANGED"
  | "TITLE_UPDATED"
  | "DESCRIPTION_UPDATED"
  | "DETAILS_UPDATED"
  | "TASK_ASSIGNED"
  | "TASK_UNASSIGNED"
  | "ATTACHMENT_ADDED"
  | "ATTACHMENT_DELETED"
  | "COMMENT_ADDED";

export interface IActivityDetails {
  oldValue?: string;
  newValue?: string;
  fileName?: string;
  assignedToName?: string;
  comment?: string;
}

export interface IActivity extends Document {
  task: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: ActivityType;
  details?: IActivityDetails;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "TASK_CREATED",
        "STATUS_CHANGED",
        "TITLE_UPDATED",
        "DESCRIPTION_UPDATED",
        "DETAILS_UPDATED",
        "TASK_ASSIGNED",
        "TASK_UNASSIGNED",
        "ATTACHMENT_ADDED",
        "ATTACHMENT_DELETED",
        "COMMENT_ADDED",
      ],
      required: true,
    },
    details: {
      oldValue: { type: String },
      newValue: { type: String },
      fileName: { type: String },
      assignedToName: { type: String },
      comment: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ task: 1, createdAt: -1 });

const Activity = mongoose.model<IActivity>("Activity", activitySchema);

export default Activity;
