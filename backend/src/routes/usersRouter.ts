import { Router } from "express";
import tryCatch from "../utils/tryCatch.js";
import validate from "../middlewares/validate.js";
import UsersController from "../controllers/usersController.js";
import { EditUserBodySchema } from "../schema/usersValidation.js";
import upload from "../utils/upload.js";
import { normalizeUserBody } from "../middlewares/nomalize.js";

const usersRouter = Router();

usersRouter
  .get("/", tryCatch(new UsersController().getUsers, "getUsers"))
  .get("/:username", tryCatch(new UsersController().getUser, "getUser"))
  .patch(
    "/:username",
    upload.single("avatar"),
    normalizeUserBody,
    validate({ body: EditUserBodySchema }),
    tryCatch(new UsersController().updateUser, "updateUser")
  )
  .delete(
    "/:username",
    tryCatch(new UsersController().deleteUser, "deleteUser")
  );

export default usersRouter;
