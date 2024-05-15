import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    roleName: String,
    roleId: Number,
  },
  { timestamps: true }
);

const role = new mongoose.model("role", roleSchema, "role");
export { role };
