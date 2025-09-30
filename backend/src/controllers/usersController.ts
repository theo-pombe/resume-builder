import { type Request, type Response } from "express";
import User from "../models/User.js";
import { NotFoundError } from "../utils/apiError.js";

class UsersController {
  getUsers = async (req: Request, res: Response) => {
    const users = await User.find({ deletedAt: null })
      .populate("resumes", "_id title")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  };

  getUser = async (req: Request, res: Response) => {
    const { username } = req.params;

    const user = await User.findOne({ username, deletedAt: null }).populate(
      "resumes",
      "_id title"
    );
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
