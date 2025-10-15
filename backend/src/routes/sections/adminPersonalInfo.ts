import { Router } from "express";
import tryCatch from "../../utils/tryCatch.js";
import PersonalInfoController from "../../controllers/sections/personalInfo.js";
import validate from "../../middlewares/validate.js";
import { editPersonalInfoSchema } from "../../schema/sections/personalInfo.js";

const adminPersonalInfoRouter = Router();

adminPersonalInfoRouter
  .get(
    "/",
    tryCatch(new PersonalInfoController().getPersonalInfos, "getPersonalInfos")
  )
  .get(
    "/:id",
    tryCatch(
      new PersonalInfoController().getPersonalInfoById,
      "getPersonalInfoById"
    )
  )
  .patch(
    "/:id",
    validate({ body: editPersonalInfoSchema }),
    tryCatch(
      new PersonalInfoController().editPersonalInfoById,
      "editPersonalInfoById"
    )
  )
  .delete(
    "/:id",
    tryCatch(
      new PersonalInfoController().deletePersonalInfoById,
      "deletePersonalInfoById"
    )
  );

export default adminPersonalInfoRouter;
