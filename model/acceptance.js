import mongoose from "mongoose";

const acceptanceSchema = new mongoose.Schema({
  taskId: String,
  assigneeId: String,
  status: { type: String, default: "working" },
  startingDate: { type: Date, default: new Date().toString() },
  lastDate: Date,
});

const acceptance = new mongoose.model(
  "acceptance",
  acceptanceSchema,
  "acceptance"
);

export { acceptance };
