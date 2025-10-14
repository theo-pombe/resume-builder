import { Router } from "express";
import PersonalInfoController from "../../controllers/sections/personalInfo.js";
import tryCatch from "../../utils/tryCatch.js";
import validate from "../../middlewares/validate.js";
import { addPersonalInfoSchema } from "../../schema/sections/personalInfo.js";

const userPersonalInfoRouter = Router({ mergeParams: true });

userPersonalInfoRouter
  .post(
    "/",
    validate({ body: addPersonalInfoSchema }),
    tryCatch(new PersonalInfoController().addPersonalInfo, "addPersonalInfo")
  )
  .get(
    "/",
    tryCatch(new PersonalInfoController().getPersonalInfo, "getPersonalInfo")
  )
  .patch(
    "/",
    validate({ body: addPersonalInfoSchema }),
    tryCatch(new PersonalInfoController().editPersonalInfo, "editPersonalInfo")
  );

export default userPersonalInfoRouter;
