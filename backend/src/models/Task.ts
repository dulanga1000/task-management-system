import mongoose, { Document, Schema } from "mongoose";

export const TASK_STATUS = {
  TODO: "TODO",
  DOING: "DOING",
  DONE: "DONE",
} as const;

export type TaskStatus =
  typeof TASK_STATUS[keyof typeof TASK_STATUS];

export interface ITaskLabel {
  name: string;
  color: string;
}

export interface ITaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  creator: mongoose.Types.ObjectId;
  assignedUser: mongoose.Types.ObjectId | null;
  labels: ITaskLabel[];
  dueDate: Date | null;
  checklist: ITaskChecklistItem[];
  order: number;
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

    labels: {
      type: [
        {
          name: { type: String, required: true },
          color: { type: String, required: true },
        },
      ],
      default: [],
    },

    dueDate: {
      type: Date,
      default: null,
    },

    checklist: {
      type: [
        {
          id: { type: String, required: true },
          text: { type: String, required: true },
          completed: { type: Boolean, default: false },
        },
      ],
      default: [],
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ createdAt: -1 });

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;