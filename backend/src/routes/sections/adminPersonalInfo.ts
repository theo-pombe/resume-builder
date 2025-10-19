import { Router } from "express";
import tryCatch from "../../utils/tryCatch.js";
import PersonalInfoController from "../../controllers/sections/personalInfo.js";
import validate from "../../middlewares/validate.js";
import { editPersonalInfoSchema } from "../../schema/sections/personalInfo.js";
import { paramsWithIDsSchema } from "../../schema/index.validate.js";

const adminPersonalInfoRouter = Router();

adminPersonalInfoRouter
  .get(
    "/",
    tryCatch(new PersonalInfoController().getPersonalInfos, "getPersonalInfos")
  )
  .get(
    "/:id",
    validate({ params: paramsWithIDsSchema }),
    tryCatch(
      new PersonalInfoController().getPersonalInfoById,
      "getPersonalInfoById"
    )
  )
  .patch(
    "/:id",
    validate({ params: paramsWithIDsSchema, body: editPersonalInfoSchema }),
    tryCatch(
      new PersonalInfoController().editPersonalInfoById,
      "editPersonalInfoById"
    )
  )
  .delete(
    "/:id",
    validate({ params: paramsWithIDsSchema }),
    tryCatch(
      new PersonalInfoController().deletePersonalInfoById,
      "deletePersonalInfoById"
    )
  );

export default adminPersonalInfoRouter;
