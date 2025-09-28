import { Router } from "express";
import tryCatch from "../utils/tryCatch.js";
import AuthController from "../controllers/authController.js";
import validate from "../middlewares/validate.js";
import {
  loginBodySchema,
  registerBodySchema,
} from "../schema/authValidation.js";

const authRouter = Router();

authRouter
  .post(
    "/register",
    validate({ body: registerBodySchema }),
    tryCatch(new AuthController().register, "Register")
  )
  .post(
    "/login",
    validate({ body: loginBodySchema }),
    tryCatch(new AuthController().login, "login")
  );

export default authRouter;
