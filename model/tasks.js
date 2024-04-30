import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  assignedBy: String,
  assignee: String,
  assigneeId: String,
  taskType: String,
  description: String,
  lastDate: Date,
  priority: String,
  acceptanceStatus: { type: Boolean, default: false },
  taskStatus: { type: String, default: "open" },
});

const task = new mongoose.model("task", taskSchema, "task");

export { task };
