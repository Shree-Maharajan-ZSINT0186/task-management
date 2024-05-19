import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    assignedBy: String,
    assignedById: String,
    assignee: String,
    assigneeId: String,
    taskType: {
      type: String,
      enum: ["bug", "enhance"],
    },
    description: String,
    lastDate: Date,
    priority: { type: Number, enum: [1, 2, 3] },
    taskStatus: {
      type: String,
      default: "open",
      enum: ["open", "in progress", "request", "completed", "backlog"],
    },
    startingDate: Date,
  },
  { timestamps: true }
);

const task = new mongoose.model("task", taskSchema, "task");
export { task };
