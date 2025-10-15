import { Router } from "express";
import usersRouter from "./usersRouter.js";
import adminResumesRouter from "./adminResumesRouter.js";
import adminPersonalInfoRouter from "./sections/adminPersonalInfo.js";

const adminRouter = Router();

adminRouter
  .use("/users", usersRouter)
  .use("/resumes", adminResumesRouter)
  .use("/personal-informations", adminPersonalInfoRouter);

export default adminRouter;
