import { Router } from "express";
import ResumesController from "../controllers/resumesController.js";
import tryCatch from "../utils/tryCatch.js";
import upload from "../utils/upload.js";
import validate from "../middlewares/validate.js";
import { updateResumeBodySchema } from "../schema/resumeValidation.js";
import { normalizeResumeBody } from "../middlewares/nomalize.js";
import { paramsWithIDsSchema } from "../schema/index.validate.js";

const adminResumesRouter = Router();

adminResumesRouter
  .get("/", tryCatch(new ResumesController().getResumes, "getResumes"))
  .get(
    "/:id",
    validate({ params: paramsWithIDsSchema }),
    tryCatch(new ResumesController().getResume, "getResume")
  )
  .patch(
    "/:id",
    upload.single("avatar"),
    normalizeResumeBody,
    validate({ params: paramsWithIDsSchema, body: updateResumeBodySchema }),
    tryCatch(new ResumesController().updateResume, "updateResume")
  )
  .delete(
    "/:id",
    validate({ params: paramsWithIDsSchema }),
    tryCatch(new ResumesController().deleteResume, "deleteResume")
  );

export default adminResumesRouter;
