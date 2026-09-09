import mongoose, { Document, Schema } from "mongoose";

export const TASK_STATUS = {
  TODO: "TODO",
  DOING: "DOING",
  DONE: "DONE",
} as const;

export type TaskStatus =
  typeof TASK_STATUS[keyof typeof TASK_STATUS];

export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  creator: mongoose.Types.ObjectId;
  assignedUser: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.TODO,
    },

    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ createdAt: -1 });

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;