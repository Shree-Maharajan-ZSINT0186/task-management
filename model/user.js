import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: String,
  password: String,
  roleId: { type: Number, default: 0 },
});

const user = new mongoose.model("user", userSchema, "user");

export { user };
