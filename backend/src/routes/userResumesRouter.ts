import { Router } from "express";
import ResumesController from "../controllers/resumesController.js";
import tryCatch from "../utils/tryCatch.js";
import upload from "../utils/upload.js";
import validate from "../middlewares/validate.js";
import {
  createResumeBodySchema,
  updateResumeBodySchema,
} from "../schema/resumeValidation.js";
import { normalizeResumeBody } from "../middlewares/nomalize.js";
import userPersonalInfoRouter from "./sections/userPersonalInfo.js";
import { paramsWithIDsSchema } from "../schema/index.validate.js";

const userResumesRouter = Router();

userResumesRouter
  .post(
    "/",
    upload.single("avatar"),
    normalizeResumeBody,
    validate({ body: createResumeBodySchema }),
    tryCatch(new ResumesController().createResume, "createResume")
  )
  .get("/", tryCatch(new ResumesController().getUserResumes, "getUserResumes"))
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

userResumesRouter.use(
  "/:resumeId/personal-information",
  userPersonalInfoRouter
);

export default userResumesRouter;
