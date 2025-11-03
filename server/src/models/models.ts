import mongoose, { Schema, Types } from "mongoose";
const contentType = ["image", "doc", "video", "audio", "tweet"];

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    verified: { type: Boolean, default: false },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const contentSchema = new mongoose.Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentType, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: Types.ObjectId, ref: "tag" }],
  userId: { type: Types.ObjectId, ref: "user", required: true },
});

const tagSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const linkSchema = new mongoose.Schema({
  hash: { type: String, required: true, unique: true },
  contentId: { type: Types.ObjectId, ref: "content", required: true },
});

export const userModel = mongoose.model("user", userSchema);
export const contentModel = mongoose.model("content", contentSchema);
export const tagModel = mongoose.model("tag", tagSchema);
export const linkModel = mongoose.model("link", linkSchema);
