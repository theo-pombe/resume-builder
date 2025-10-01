import type { Request, Response } from "express";
import { Resume, User } from "../models/index.js";
import type { IResume } from "../models/Resume.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/apiError.js";

class ResumesController {
  createResume = async (req: Request, res: Response) => {
    const userId = req.user.id;

    let avatarFile: string | undefined;
    if (req.file) {
      avatarFile = req.file.filename;
    } else {
      const user = await User.findById(userId).select("avatar");
      avatarFile = user?.avatar || undefined;
    }

    const exists = await Resume.findOne({
      user: userId,
      title: req.body.title,
      deletedAt: null,
    });
    if (exists) {
      throw new ConflictError("Resume with this title already exists");
    }

    await Resume.create({
      user: userId,
      title: req.body.title,
      summary: req.body.summary,
      avatar: avatarFile,
      declaration: req.body.declaration || {},
    });

    return res.status(201).json({
      success: true,
      message: "Resume created successfully",
    });
  };

  getResumes = async (req: Request, res: Response) => {
    const resumes = await Resume.find({ deletedAt: null })
      .populate("user", "username email avatar")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Resumes fetched successfully",
      data: resumes.map((r) => this.normalizeResume(req, r)),
    });
  };

  getUserResumes = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const resumes = await Resume.find({ user: userId, deletedAt: null }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      message: "User resumes fetched successfully",
      data: resumes.map((r) => this.normalizeResume(req, r)),
    });
  };

  getResume = async (req: Request, res: Response) => {
    const { id } = req.params;
    const resume = await Resume.findOne({ _id: id, deletedAt: null }).populate(
      "user",
      "username email avatar"
    );

    if (!resume) throw new NotFoundError("Resume not found");

    return res.json({
      success: true,
      message: "Resume fetched successfully",
      data: this.normalizeResume(req, resume),
    });
  };

  updateResume = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    const resume = await Resume.findById(id);
    if (!resume || resume.deletedAt)
      throw new NotFoundError("Resume not found");

    if (!isAdmin && resume.user.toString() !== userId) {
      throw new UnauthorizedError("You cannot update this resume");
    }

    if (req.file) {
      resume.avatar = req.file.filename;
    }

    if (req.body.title && req.body.title !== resume.title) {
      const exists = await Resume.findOne({
        user: userId,
        title: req.body.title,
        deletedAt: null,
        _id: { $ne: id },
      });
      if (exists) {
        throw new ConflictError("Resume with this title already exists");
      }
    }

    resume.title = req.body.title ?? resume.title;
    resume.summary = req.body.summary ?? resume.summary;
    resume.declaration = req.body.declaration ?? resume.declaration;

    await resume.save();

    return res.json({
      success: true,
      message: "Resume updated successfully",
      data: this.normalizeResume(req, resume),
    });
  };

  deleteResume = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    const resume = await Resume.findById(id);
    if (!resume || resume.deletedAt)
      throw new NotFoundError("Resume not found");

    if (!isAdmin && resume.user.toString() !== userId) {
      throw new UnauthorizedError("You cannot delete this resume");
    }

    resume.deletedAt = new Date();
    resume.deletedBy = userId;
    await resume.save();

    return res.json({
      success: true,
      message: "Resume deleted successfully",
      data: this.normalizeResume(req, resume),
    });
  };

  private normalizeResume(req: Request, resume: IResume) {
    if (!resume) return resume;
    const obj = resume.toJSON ? resume.toJSON() : resume;

    if (obj.avatar) {
      obj.avatar = `${req.protocol}://${req.get("host")}/uploads/${obj.avatar}`;
    }
    return obj;
  }
}

export default ResumesController;
