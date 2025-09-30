import type { Request, Response } from "express";
import User from "../models/User.js";
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from "../utils/apiError.js";

class AccountController {
  /**
   * Get account info (self)
   */
  getAccount = async (req: Request, res: Response) => {
    const { username } = req.params;

    // enforce self-access only
    if (req.user?.username !== username) {
      throw new ForbiddenError("You can only access your own account");
    }

    const user = await User.findOne({ username, deletedAt: null }).select(
      "-password"
    );
    if (!user) throw new NotFoundError("User not found");

    res.status(200).json({
      success: true,
      message: "Account retrieved successfully",
      data: user,
    });
  };

  /**
   * Update account info (self only)
   */
  updateAccount = async (req: Request, res: Response) => {
    const { username } = req.params;

    // enforce self-update only
    if (req.user?.username !== username) {
      throw new ForbiddenError("You can only update your own account");
    }

    const { newUsername, newEmail, newPassword } = req.body;
    const existingUser = await User.findOne({ username, deletedAt: null });
    if (!existingUser) throw new NotFoundError("User not found");

    // validate uniqueness
    if (newUsername && newUsername !== existingUser.username) {
      const taken = await User.findOne({ username: newUsername });
      if (taken) throw new ConflictError("Username already taken");
      existingUser.username = newUsername;
    }

    if (newEmail && newEmail !== existingUser.email) {
      const taken = await User.findOne({ email: newEmail });
      if (taken) throw new ConflictError("Email already in use");
      existingUser.email = newEmail;
    }

    if (newPassword) existingUser.password = newPassword; // pre-save hook will hash

    const user = await existingUser.save();

    res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  };
}

export default AccountController;
