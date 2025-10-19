import { Router } from "express";
import {
  addSchoolQualificationBodySchema,
  updateSchoolQualificationBodySchema,
} from "../../schema/sections/schoolQ.js";
import { paramsWithIDsSchema } from "../../schema/index.validate.js";
import upload from "../../utils/upload.js";
import tryCatch from "../../utils/tryCatch.js";
import SchoolQualificationsController from "../../controllers/sections/schoolQualifications.js";
import validate from "../../middlewares/validate.js";
import { normalizeSchoolBody } from "../../middlewares/nomalize.js";

const schoolQualificationsRouter = Router({ mergeParams: true });
const adminSchoolQualificationsRouter = Router();

schoolQualificationsRouter
  .post(
    "/",
    upload.single("certificate"),
    normalizeSchoolBody,
    validate({
      body: addSchoolQualificationBodySchema,
      params: paramsWithIDsSchema,
    }),
    tryCatch(
      new SchoolQualificationsController().addSchool,
      "addSchoolQualifications"
    )
  )
  .get(
    "/",
    validate({ params: paramsWithIDsSchema }),
    tryCatch(
      new SchoolQualificationsController().getSchools,
      "getSchoolQualifications"
    )
  )
  .patch(
    "/:id",
    upload.single("certificate"),
    normalizeSchoolBody,
    validate({
      body: updateSchoolQualificationBodySchema,
      params: paramsWithIDsSchema,
    }),
    tryCatch(
      new SchoolQualificationsController().updateSchool,
      "updateSchoolQualification"
    )
  )
  .delete(
    "/:id",
    validate({ params: paramsWithIDsSchema }),
    tryCatch(
      new SchoolQualificationsController().deleteSchool,
      "deleteSchoolQualification"
    )
  );

adminSchoolQualificationsRouter
  .get(
    "/",
    tryCatch(
      new SchoolQualificationsController().getAllSchools,
      "getSchoolQualifications"
    )
  )
  .get(
    "/:id",
    validate({ params: paramsWithIDsSchema }),
    tryCatch(
      new SchoolQualificationsController().getSchoolById,
      "getSchoolQualification"
    )
  )
  .patch(
    "/:id",
    upload.single("certificate"),
    normalizeSchoolBody,
    validate({
      body: updateSchoolQualificationBodySchema,
      params: paramsWithIDsSchema,
    }),
    tryCatch(
      new SchoolQualificationsController().updateSchoolById,
      "updateSchoolQualification"
    )
  )
  .delete(
    "/:id",
    validate({ params: paramsWithIDsSchema }),
    tryCatch(
      new SchoolQualificationsController().deleteSchoolById,
      "deleteSchoolQualification"
    )
  );

export { schoolQualificationsRouter, adminSchoolQualificationsRouter };
