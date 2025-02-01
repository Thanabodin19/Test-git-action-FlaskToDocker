import mongoose, { Schema, Document } from "mongoose";
import { unique } from "next/dist/build/utils";

interface User extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    id: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      require: [true, "Password is required"],
    },
    name: {
      type: String,
      require: [true, "Name is required"],
    },
    role: {
      type: String,
      require: false,
      default: "viewer",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
