import mongoose from "mongoose";
async function connectDb() {
  return await mongoose.connect("mongodb://localhost:27017/tasks");
}
export default connectDb;
