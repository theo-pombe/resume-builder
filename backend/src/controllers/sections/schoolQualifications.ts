import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../../utils/apiError.js";
import { Resume, EducationBackground } from "../../models/index.js";
import type { ISchool } from "../../models/sub-schemas/SchoolQualification.js";
import type { Types } from "mongoose";
import mongoose from "mongoose";

interface SchoolsQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: "asc" | "desc" | string;
  level?: string;
  award?: string;
  schoolName?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SchoolQualificationsController {
  addSchool = async (req: Request, res: Response) => {
    const file = this.validatePDF(req.file);

    const resume = await this.getResume(req.params.resumeId);
    const education = await this.getEducationOrCreate(resume.id);

    const existingIndex = education.schoolQualifications.findIndex(
      (q) => q.level === req.body.level
    );

    let school: ISchool;
    if (existingIndex !== -1) {
      school = {
        ...education?.schoolQualifications[existingIndex]?.toObject(),
        ...req.body,
      };

      school.certificate = file.filename;
      education.schoolQualifications[existingIndex] = school;
    } else {
      school = {
        ...req.body,
      };

      school.certificate = file.filename;
      education.schoolQualifications.push(school);
    }

    const savedEducation = await education.save();

    return res.status(201).json({
      success: true,
      message:
        existingIndex !== -1
          ? "School qualification updated successfully"
          : "School qualification added successfully",
      schoolQualification: school,
      schoolQualifications: savedEducation.schoolQualifications,
    });
  };

  getSchools = async (req: Request, res: Response) => {
    const resume = await this.getResume(req.params.resumeId);
    const education = await this.getEducationOrCreate(resume.id);

    const host = `${req.protocol}://${req.get("host")}`;

    const schoolQualifications =
      education?.schoolQualifications.map((q) => {
        const school: ISchool = q.toObject();
        school.certificate = school.certificate
          ? `${host}/uploads/${school.certificate}`
          : null;
        return school;
      }) || [];

    res.status(200).json({
      success: true,
      message: "School qualifications retrieved successfully",
      schoolQualifications,
    });
  };

  updateSchool = async (req: Request, res: Response) => {
    const resume = await this.getResume(req.params.resumeId);
    const education = await this.getEducationByResume(resume.id);

    const index = education.schoolQualifications.findIndex((q) =>
      q.id.equals(req.params.id)
    );
    if (index === -1)
      throw new NotFoundError("School qualification doesn't exist");

    const school = education.schoolQualifications[index];
    if (!school) throw new NotFoundError("School qualification not found");

    const file = this.validatePDF(req.file);
    if (school.certificate) this.deleteFile(school.certificate);

    school.certificate = file.filename;
    school.set(req.body);

    await education.save();

    res.status(200).json({
      success: true,
      message: "School qualification updated successfully",
      schoolQualification: school.toObject(),
    });
  };

  deleteSchool = async (req: Request, res: Response) => {
    const resume = await this.getResume(req.params.resumeId);
    const education = await this.getEducationByResume(resume.id);

    const originalLength = education.schoolQualifications.length;
    education.schoolQualifications = education.schoolQualifications.filter(
      (q) => !q.id.equals(req.params.id)
    );

    if (education.schoolQualifications.length === originalLength)
      throw new NotFoundError("School qualification doesn't exist");

    await education.save();

    res.status(200).json({
      success: true,
      message: "School qualification deleted successfully",
    });
  };

  getAllSchools = async (
    req: Request<{}, {}, {}, SchoolsQuery>,
    res: Response
  ) => {
    const {
      page: pageQ = "1",
      limit: limitQ = "25",
      level,
      award,
      schoolName,
    } = req.query;

    const educations = await EducationBackground.find().populate(
      "resume",
      "_id title"
    );
    if (!educations) throw new NotFoundError("Education background not found");

    let results: ISchool[] = [];
    educations.map((edu) => {
      edu.schoolQualifications.map((q) =>
        results.push({ ...q.toObject(), resume: edu.resume })
      );
    });

    // Filters
    if (level) results = results.filter((s) => s.level === level);
    if (award) results = results.filter((s) => s.award === award);
    if (schoolName)
      results = results.filter((s) =>
        s.school.name.toLowerCase().includes(schoolName.toLowerCase())
      );

    // Pagination
    const page = Math.max(Number.parseInt(pageQ || "1", 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(limitQ || "25", 10) || 25, 1),
      100
    );

    const total = results.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = results.slice(start, end);

    return res.status(200).json({
      success: true,
      message: "School qualifications retrieved successfully",
      data: paginated,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  };

  getSchoolById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const education = await EducationBackground.findOne({
      "schoolQualifications._id": id,
    }).populate("resume", "_id title");

    if (!education) throw new NotFoundError("School qualification not found");

    const school = education.schoolQualifications.find((q) =>
      q._id
        ? (q._id as Types.ObjectId).equals(new mongoose.Types.ObjectId(id))
        : false
    );
    if (!school) throw new NotFoundError("School qualification not found");

    return res.status(200).json({
      success: true,
      message: "School qualification retrieved successfully",
      data: school,
    });
  };

  updateSchoolById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const education = await this.getEducationBySchoolId(id);

    const school = education.schoolQualifications.find((q) =>
      q._id
        ? (q._id as Types.ObjectId).equals(new mongoose.Types.ObjectId(id))
        : false
    );
    if (!school) throw new NotFoundError("School qualification not found");

    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed for certificate",
        });
      }
      updateData.certificate = req.file.filename;
    }
    Object.assign(school, updateData);

    await education.save();

    return res.status(200).json({
      success: true,
      message: "School qualification updated successfully",
      data: school,
    });
  };

  deleteSchoolById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const education = await this.getEducationBySchoolId(id);

    const school = education.schoolQualifications.find((q) =>
      q._id
        ? (q._id as Types.ObjectId).equals(new mongoose.Types.ObjectId(id))
        : false
    );
    if (!school) throw new NotFoundError("School qualification not found");
    if (school?.certificate) this.deleteFile(school.certificate);

    const originalLength = education.schoolQualifications.length;
    education.schoolQualifications = education.schoolQualifications.filter(
      (q) => !q.id.equals(id)
    );

    if (education.schoolQualifications.length === originalLength)
      throw new NotFoundError("school qualification doesn't exist");

    await education.save();

    return res.status(200).json({
      success: true,
      message: "School qualification deleted successfully",
    });
  };

  private getResume = async (resumeId: string | undefined) => {
    const resume = await Resume.findById(resumeId);
    if (!resume) throw new NotFoundError("Resume not found");
    return resume;
  };

  private getEducationByResume = async (resumeId: string) => {
    const education = await EducationBackground.findOne({ resume: resumeId });
    if (!education)
      throw new NotFoundError("Education background doesn't exist");
    return education;
  };

  private getEducationOrCreate = async (resumeId: string) => {
    let education = await EducationBackground.findOne({ resume: resumeId });
    if (!education) {
      education = new EducationBackground({
        resume: resumeId,
        schoolQualifications: [],
        academicQualifications: [],
      });
    }
    return education;
  };

  private getEducationBySchoolId = async (id: string | undefined) => {
    const education = await EducationBackground.findOne({
      "schoolQualifications._id": id,
    });
    if (!education) throw new NotFoundError("School qualification not found");
    return education;
  };

  private validatePDF = (file: Express.Multer.File | undefined) => {
    if (file && file.mimetype === "application/pdf") return file;
    throw new BadRequestError("Only PDF files are allowed");
  };

  private deleteFile = (filename: string) => {
    const filePath = path.join(__dirname, "../uploads/certificates", filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("Failed to delete file:", filePath, err);
      }
    }
  };
}

export default SchoolQualificationsController;
