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
    division: GradeDivision;
    points: number;
  }

  export interface SchoolType {
    id: string;
    resume: string | ResumeType;
    level: SchoolLevel;
    award: SchoolAward;
    school: SchoolInfo;
    startYear: number;
    endYear: number;
    grade?: SchoolGrade;
    certificate?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    deletedBy?: string;
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
    grade?: {
      division: GradeDivision | "";
      points: string | number;
    };
    certificate?: File | string;
  }

  export interface SchoolApiPayload {
    level: SchoolLevel;
    award: SchoolAward;
    school: SchoolInfo;
    startYear: number;
    endYear: number;
    grade?: {
      division?: GradeDivision;
      points?: number;
    };
    certificate?: string;
  }

  export function normalizeSchoolFormToApi(
    form: SchoolFormDataValues
  ): SchoolApiPayload;
}
