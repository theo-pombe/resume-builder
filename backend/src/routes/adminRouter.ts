import { Router } from "express";
import usersRouter from "./usersRouter.js";
import adminResumesRouter from "./adminResumesRouter.js";
import adminPersonalInfoRouter from "./sections/adminPersonalInfo.js";
import { adminSchoolQualificationsRouter } from "./sections/schoolQualifications.js";

const adminRouter = Router();

adminRouter
  .use("/users", usersRouter)
  .use("/resumes", adminResumesRouter)
  .use("/personal-informations", adminPersonalInfoRouter)
  .use("/school-qualifications", adminSchoolQualificationsRouter);

export default adminRouter;
