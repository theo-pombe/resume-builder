import { type Request, type Response } from "express";
import { NotFoundError } from "../utils/apiError.js";
import { User } from "../models/index.js";

class UsersController {
  getUsers = async (req: Request, res: Response) => {
    const users = await User.find({ deletedAt: null })
      .populate("resumes")
      .sort({ createdAt: -1 });

    const host = `${req.protocol}://${req.get("host")}`;

    const usersResponse = users.map((u) => {
      const userObj = u.toObject();
      return {
        id: userObj.id,
        username: userObj.username,
        email: userObj.email,
        role: userObj.role,
        avatar: userObj.avatar ? `${host}/uploads/${userObj.avatar}` : null, // full URL for avatar
        totalResume: userObj.resumes?.length,
        isActive: userObj.isActive,
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: usersResponse,
    });
  };

  getUser = async (req: Request, res: Response) => {
    const { username } = req.params;

    const user = await User.findOne({ username, deletedAt: null }).populate(
      "resumes",
      "id title createdAt updatedAt"
    );

    if (!user) throw new NotFoundError("User not found");

    const host = `${req.protocol}://${req.get("host")}`;
    const userObj = user.toObject();
    userObj.avatar = userObj.avatar
      ? `${host}/uploads/${userObj.avatar}`
      : null;

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: userObj,
    });
  };

  updateUser = async (req: Request, res: Response) => {
    const { username } = req.params;

    // Build the update object dynamically
    const updateData: Record<string, any> = { ...req.body };

    // If an avatar file was uploaded, save its filename
    if (req.file) {
      updateData.avatar = req.file.filename;
    }

    const user = await User.findOneAndUpdate({ username }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

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
