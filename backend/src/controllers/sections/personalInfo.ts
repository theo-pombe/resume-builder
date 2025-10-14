import type { Request, Response } from "express";
import { Resume, PersonalInfo } from "../../models/index.js";
import { ConflictError, NotFoundError } from "../../utils/apiError.js";

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
}

export default PersonalInfoController;
