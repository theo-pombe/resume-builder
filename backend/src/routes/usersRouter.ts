import { Router } from "express";
import tryCatch from "../utils/tryCatch.js";
import validate from "../middlewares/validate.js";
import UsersController from "../controllers/usersController.js";
import { EditUserBodySchema } from "../schema/usersValidation.js";
import upload from "../utils/upload.js";
import { normalizeUserBody } from "../middlewares/nomalize.js";
import { paramsWithIDsSchema } from "../schema/index.validate.js";

const usersRouter = Router();

usersRouter
  .get("/", tryCatch(new UsersController().getUsers, "getUsers"))
  .get(
    "/:username",
    validate({ params: paramsWithIDsSchema }),
    tryCatch(new UsersController().getUser, "getUser")
  )
  .patch(
    "/:username",
    upload.single("avatar"),
    normalizeUserBody,
    validate({ params: paramsWithIDsSchema, body: EditUserBodySchema }),
    tryCatch(new UsersController().updateUser, "updateUser")
  )
  .delete(
    "/:username",
    validate({ params: paramsWithIDsSchema }),
    tryCatch(new UsersController().deleteUser, "deleteUser")
  );

export default usersRouter;
