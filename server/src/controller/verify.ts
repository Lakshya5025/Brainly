import { Request, Response } from "express";
import { userModel } from "../models/models.js";

export async function verify(req: Request, res: Response) {
  const { otp, email } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP are required" });
  try {
    const record = await userModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!record)
      return res
        .status(404)
        .json({ message: "No OTP request found for this email" });

    if (record.verified)
      return res.status(200).json({ message: "Email already verified" });

    if (!record.otpExpiry || new Date() > new Date(record.otpExpiry)) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    if (String(record.otp) === String(otp)) {
      record.verified = true;
      record.otp = "";
      await record.save();
      return res.status(200).json({ message: "Verification complete" });
    } else {
      await record.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("verify-otp error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
