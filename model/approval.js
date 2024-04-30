import mongoose from "mongoose";

const approvalSchema = new mongoose.Schema({
  taskId: String,
  assigneeId: String,
  status: { type: String, default: "working" },
  startingDate: { type: Date, default: new Date().toString() },
  lastDate: Date,
});

const approval = new mongoose.model("approval", approvalSchema, "approval");

export { approval };
