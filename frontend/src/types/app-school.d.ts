declare module "app-school" {
  import type { ResumeType } from "app-resume";

  export type SchoolLevel = "Primary" | "O-Level" | "A-Level";

  export type SchoolAward =
    | "Primary School Leaving Examination (PSLE)"
    | "The Certificate of Secondary Education Examination (CSEE)"
    | "Advanced Certificate of Secondary Education Examination (ACSEE)";

  export type GradeDivision = "I" | "II" | "III" | "IV" | "0";

  export interface SchoolInfo {
    name: string;
    location: string;
  }

  export interface SchoolGrade {
    division?: GradeDivision | null;
    points?: number | null;
  }

  export interface SchoolType {
    id: string;
    resume: string | ResumeType;
    level: SchoolLevel;
    award: SchoolAward;
    school: SchoolInfo;
    startYear: number;
    endYear: number;
    grade?: SchoolGrade | null;
    certificate?: string | null;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    deletedBy?: string | null;
  }

  export interface SchoolFormDataValues {
    level: SchoolLevel | "";
    award: SchoolAward | "";
    school: {
      name: string;
      location: string;
    };
    startYear: string | number;
    endYear: string | number;
    grade: {
      division?: GradeDivision | "" | null;
      points?: string | number | null;
    } | null;
    certificate?: File | string | null;
  }

  export interface SchoolApiPayload {
    level: SchoolLevel;
    award: SchoolAward;
    school: SchoolInfo;
    startYear: number;
    endYear: number;
    grade?: {
      division?: GradeDivision | null;
      points?: number | null;
    } | null;
    certificate?: string | null;
  }

  export function normalizeSchoolFormToApi(
    form: SchoolFormDataValues
  ): SchoolApiPayload;
}
