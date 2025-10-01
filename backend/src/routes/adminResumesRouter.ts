import { Router } from "express";
import ResumesController from "../controllers/resumesController.js";
import tryCatch from "../utils/tryCatch.js";
import upload from "../utils/upload.js";
import validate from "../middlewares/validate.js";
import { updateResumeBodySchema } from "../schema/resumeValidation.js";

const adminResumesRouter = Router();

adminResumesRouter
  .get("/", tryCatch(new ResumesController().getResumes, "getResumes"))
  .get("/:id", tryCatch(new ResumesController().getResume, "getResume"))
  .patch(
    "/:id",
    upload.single("avatar"),
    validate({ body: updateResumeBodySchema }),
    tryCatch(new ResumesController().updateResume, "updateResume")
  )
  .delete(
    "/:id",
    tryCatch(new ResumesController().deleteResume, "deleteResume")
  );

export default adminResumesRouter;
