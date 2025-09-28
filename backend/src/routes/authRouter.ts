import { Router } from "express";
import tryCatch from "../utils/tryCatch.js";
import AuthController from "../controllers/authController.js";

const authRouter = Router();

authRouter
  .post("/register", tryCatch(new AuthController().register, "Register"))
  .post("/login", tryCatch(new AuthController().login, "login"));

export default authRouter;
