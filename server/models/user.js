import mongoose from "mongoose";

const userSechmea = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "vendor"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSechmea);

export default UserModel;
