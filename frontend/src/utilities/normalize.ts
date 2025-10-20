import type { SchoolFormDataValues, SchoolApiPayload } from "app-school";

export function normalizeSchoolFormToApi(
  form: SchoolFormDataValues
): SchoolApiPayload {
  const startYear =
    typeof form.startYear === "string" ? form.startYear.trim() : form.startYear;
  const endYear =
    typeof form.endYear === "string" ? form.endYear.trim() : form.endYear;

  const payload: SchoolApiPayload = {
    level: form.level as any,
    award: form.award as any,
    school: {
      name: form.school.name.trim(),
      location: form.school.location.trim(),
    },
    startYear: Number(startYear),
    endYear: Number(endYear),
  };

  if (form.grade) {
    const pointsRaw = form.grade.points;
    const points =
      typeof pointsRaw === "string"
        ? pointsRaw.trim() === ""
          ? null
          : Number(pointsRaw)
        : typeof pointsRaw === "number"
        ? pointsRaw
        : null;

    payload.grade = {
      division:
        form.grade.division === ""
          ? (null as null)
          : form.grade.division ?? null,
      points: Number.isFinite(points) ? points : null,
    };
  } else {
    payload.grade = null;
  }

  if (typeof form.certificate === "string") {
    payload.certificate = form.certificate || null;
  }

  return payload;
}
