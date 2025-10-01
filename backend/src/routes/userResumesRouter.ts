import { Router } from "express";
import ResumesController from "../controllers/resumesController.js";
import tryCatch from "../utils/tryCatch.js";
import upload from "../utils/upload.js";

const userResumesRouter = Router();

userResumesRouter
  .post(
    "/",
    upload.single("avatar"),
    tryCatch(new ResumesController().createResume, "createResume")
  )
  .get("/", tryCatch(new ResumesController().getUserResumes, "getUserResumes"))
  .get("/:id", tryCatch(new ResumesController().getResume, "getResume"))
  .patch("/:id", tryCatch(new ResumesController().updateResume, "updateResume"))
  .delete(
    "/:id",
    tryCatch(new ResumesController().deleteResume, "deleteResume")
  );

export default userResumesRouter;
