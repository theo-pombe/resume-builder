import { type Request, type Response } from "express";
import User from "../models/User.js";
import { compareHash } from "../utils/hashing.js";
import { generateToken } from "../utils/jwt.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/apiError.js";

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

interface LoginBody {
  usernameOrEmail: string;
  password: string;
}

class AuthController {
  register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body as RegisterBody;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser)
      throw new ConflictError("Username or email already exists");

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  };

  login = async (req: Request, res: Response) => {
    const { usernameOrEmail, password } = req.body as LoginBody;

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      deletedAt: null,
    }).select("+password");
    if (!user) throw new NotFoundError("User not found");

    const isMatch = await compareHash(password, user.password);
    if (!isMatch) throw new UnauthorizedError("Wrong credentials");

    const token = generateToken(user);

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: userResponse,
        token,
      },
    });
  };
}

export default AuthController;
