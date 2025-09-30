import { type Request, type Response } from "express";
import { NotFoundError } from "../utils/apiError.js";
import { User } from "../models/index.js";

class UsersController {
  getUsers = async (req: Request, res: Response) => {
    const users = await User.find({ deletedAt: null })
      .populate("resumes", "id title")
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  };

  getUser = async (req: Request, res: Response) => {
    const { username } = req.params;

    const user = await User.findOne({ username, deletedAt: null })
      .populate("resumes", "id title")
      .lean({ virtuals: true });
    if (!user) throw new NotFoundError("User not found");

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  };

  updateUser = async (req: Request, res: Response) => {
    const { username } = req.params;

    const user = await User.findOneAndUpdate(
      { username },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!user) throw new NotFoundError("User not found");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  };

  deleteUser = async (req: Request, res: Response) => {
    const { username } = req.params;

    const user = await User.findOneAndUpdate(
      { username },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!user) throw new NotFoundError("User not found");

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });
  };
}

export default UsersController;
