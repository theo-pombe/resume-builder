import { Router } from "express";
import usersRouter from "./usersRouter.js";

const adminRouter = Router();

adminRouter.use("/users", usersRouter);

export default adminRouter;
