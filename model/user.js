import mongoose from "mongoose";
import validator from "validator";
const { isEmail } = validator;

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, unique: true, required: true },
    email: {
      type: String,
      // unique: true,
      required: true,
      validate: { validator: isEmail, message: "Invalid email." },
    },
    password: String,
    roleId: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const user = new mongoose.model("user", userSchema);
export { user };
