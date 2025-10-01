import { Router } from "express";
import usersRouter from "./usersRouter.js";
import adminResumesRouter from "./adminResumesRouter.js";

const adminRouter = Router();

adminRouter.use("/users", usersRouter).use("resumes", adminResumesRouter);

export default adminRouter;
