import type { Request, Response } from "express";
import { signinValidator } from "../validator/signin.js";
import { userModel } from "../models/models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export async function signin(req: Request, res: Response) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET environment variable not set!");
    return res.status(500).json({ message: "Server configuration error." });
  }
  const validationResult = signinValidator.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: "Invalid input.",
      errors: validationResult.error.flatten().fieldErrors,
    });
  }
  const { username, password } = validationResult.data;

  try {
    const user = await userModel.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }
    if (!user.verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }
    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1d" });

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    return res
      .cookie("token", token, {
        maxAge: oneDayInMilliseconds,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
      })
      .status(200)
      .json({
        message: "Login successful.",
      });
  } catch (err) {
    console.error("Error during sign-in:", err);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." });
  }
}
