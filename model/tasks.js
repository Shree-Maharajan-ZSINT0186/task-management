import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    assignedBy: String,
    assignedById: String,
    assignee: String,
    assigneeId: String,
    taskType: String,
    description: String,
    lastDate: Date,
    priority: String,
    taskStatus: { type: String, default: "open" },
    startingDate: Date,
  },
  { timestamps: true }
);

const task = new mongoose.model("task", taskSchema, "task");
export { task };
