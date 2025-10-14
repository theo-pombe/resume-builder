import type { Request, Response } from "express";
import { Resume, PersonalInfo } from "../../models/index.js";
import { ConflictError, NotFoundError } from "../../utils/apiError.js";
import type { IPersonalInfo } from "../../models/sections/PersonalInfo.js";
import type { FilterQuery } from "mongoose";

interface PersonalInfosQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: "asc" | "desc" | string;
  fullName?: string;
  email?: string;
  phone?: string;
}

const ALLOWED_SORT_FIELDS = new Set(["createdAt", "updatedAt", "fullName"]);

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

class PersonalInfoController {
  addPersonalInfo = async (req: Request, res: Response) => {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) throw new NotFoundError("Resume doesn't exists");

    const existingInfo = await PersonalInfo.findOne({ resume: resume.id });
    if (existingInfo)
      throw new ConflictError("Personal Information already exists");

    const newInfo = new PersonalInfo({ resume: resume._id, ...req.body });
    const savedInfo = await newInfo.save();

    res.status(200).json({
      success: true,
      message: "Personal information added successfully",
      data: savedInfo,
    });
  };

  getPersonalInfo = async (req: Request, res: Response) => {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) throw new NotFoundError("Resume doesn't exists");

    const existingInfo = await PersonalInfo.findOne({
      resume: resume._id,
    }).select("-__v");
    if (!existingInfo)
      throw new NotFoundError("Personal information doesn't exists");

    res.status(200).json({
      success: true,
      message: "Personal information retrieved successfully",
      data: existingInfo,
    });
  };

  editPersonalInfo = async (req: Request, res: Response) => {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) throw new NotFoundError("Resume doesn't exists");

    const updatedInfo = await PersonalInfo.findOneAndUpdate(
      { resume: resume._id },
      { ...req.body },
      { new: true }
    );
    if (!updatedInfo)
      throw new NotFoundError("Personal information doesn't exists");

    res.status(200).json({
      success: true,
      message: "Personal information updated successfully",
      data: updatedInfo,
    });
  };

  getPersonalInfos = async (
    req: Request<{}, {}, {}, PersonalInfosQuery>,
    res: Response
  ) => {
    const {
      page: pageQ = "1",
      limit: limitQ = "25",
      sort: sortQ = "createdAt",
      order: orderQ = "desc",
      fullName,
      email,
      phone,
    } = req.query;

    const page = Math.max(Number.parseInt(pageQ || "1", 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(limitQ || "25", 10) || 25, 1),
      100
    );

    const sortField = ALLOWED_SORT_FIELDS.has(sortQ) ? sortQ : "createdAt";
    const sortDirection = (orderQ || "desc").toLowerCase().startsWith("asc")
      ? 1
      : -1;

    const query: FilterQuery<IPersonalInfo> = {};
    if (fullName && typeof fullName === "string") {
      query.fullName = { $regex: escapeRegExp(fullName), $options: "i" } as any;
    }
    if (email && typeof email === "string") {
      query.email = { $regex: escapeRegExp(email), $options: "i" } as any;
    }
    if (phone && typeof phone === "string") {
      query.phone = { $regex: escapeRegExp(phone), $options: "i" } as any;
    }

    const [total, personalInfos] = await Promise.all([
      PersonalInfo.countDocuments(query),
      PersonalInfo.find(
        query,
        "_id fullName gender phone email physicalAddress"
      )
        .populate("resume", "_id title")
        .sort({ [sortField]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return res.status(200).json({
      success: true,
      message: "Personal information retrieved successfully",
      data: personalInfos,
      pagination: {
        total,
        page,
        limit,
        pages: totalPages,
      },
    });
  };

  getPersonalInfoById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const personalInfo = await PersonalInfo.findById(id).populate({
      path: "resume",
      select: "title user",
      populate: { path: "user", select: "username" },
    });

    if (!personalInfo)
      throw new NotFoundError("Personal information not found");

    return res.status(200).json({
      success: true,
      message: "Personal information retrieved successfully",
      data: personalInfo,
    });
  };

  editPersonalInfoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const personalInfo = await PersonalInfo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!personalInfo)
      throw new NotFoundError("Personal information not found");

    return res.status(200).json({
      success: true,
      message: "Personal information updated successfully",
      data: personalInfo,
    });
  };

  deletePersonalInfoById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const personalInfo = await PersonalInfo.findByIdAndDelete(id);
    if (!personalInfo)
      throw new NotFoundError("Personal information not found");

    return res.status(200).json({
      success: true,
      message: "Personal information deleted successfully",
    });
  };
}

export default PersonalInfoController;
