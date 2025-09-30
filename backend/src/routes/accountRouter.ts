import { Router } from "express";
import tryCatch from "../utils/tryCatch.js";
import AccountController from "../controllers/accountController.js";
import validate from "../middlewares/validate.js";
import { updateAccountBodySchema } from "../schema/accountValidation.js";

const accountRouter = Router();

accountRouter
  .get("/:username", tryCatch(new AccountController().getAccount, "getAccount"))
  .patch(
    "/:username",
    validate({ body: updateAccountBodySchema }),
    tryCatch(new AccountController().updateAccount, "updateAccount")
  );

export default accountRouter;
