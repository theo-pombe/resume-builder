import { type Request, type Response } from "express";
import User from "../models/User.js";

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

class AuthController {
  register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body as RegisterBody;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) throw new Error("Username or email already exists");

    const newUser = new User({ username, email, password });
    if (!newUser) throw new Error("User not created");

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  };
}

export default AuthController;
