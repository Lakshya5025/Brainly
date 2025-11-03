import type { Request, Response } from "express";
import { userModel } from "../models/models.js";
import bcrypt from "bcrypt";
import { validUser } from "../validator/signup.js";
import { MongoServerError } from "mongodb";
import { z } from "zod";
import { mailer } from "../utils/email.js";

function randomOTP() {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
}

export async function signup(req: Request, res: Response) {
  const salt = process.env.SALT;
  if (!salt) {
    console.error("SALT environment variable not set!");
    return res.status(500).json({ message: "Server configuration error." });
  }

  const saltRounds = parseInt(salt, 10);
  if (isNaN(saltRounds)) {
    console.error("SALT environment variable is not a valid number!");
    return res.status(500).json({ message: "Server configuration error." });
  }

  const validationResult = validUser.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      message: "Invalid input.",
      errors: z.treeifyError(validationResult.error),
    });
  }

  try {
    const { username, password, email } = validationResult.data;
    const otp = randomOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await mailer(email, otp);
    await userModel.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        $set: {
          otp,
          otpExpiry,
          verified: false,
          attempts: 0,
          username,
          password: hashedPassword,
        },
      },
      { upsert: true, new: true }
    );

    return res.status(201).json({
      message: "User created successfully.",
      user: {
        username,
        email,
      },
    });
  } catch (err) {
    console.error("Error during user creation:", err);
    return res.status(500).json({
      message: "Failed to create user due to a server error.",
    });
  }
}
