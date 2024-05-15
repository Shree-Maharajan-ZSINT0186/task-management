import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: String,
    token: String,
    expiry: { type: String, default: "no" },
  },
  { timestamps: true }
);

const session = new mongoose.model("session", sessionSchema, "session");
export { session };
