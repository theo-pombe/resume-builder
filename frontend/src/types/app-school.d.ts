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
    division?: GradeDivision;
    points?: string;
  }

  export interface SchoolType {
    id: string;
    resume: string | ResumeType;
    level: SchoolLevel;
    award: SchoolAward;
    school: SchoolInfo;
    startYear: Date;
    endYear: Date;
    grade: SchoolGrade;
    certificate?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface SchoolFormDataValues {
    level: SchoolLevel | "";
    award: SchoolAward | "";
    school: SchoolInfo;
    startYear: string | Date;
    endYear: string | Date;
    grade: {
      division?: GradeDivision | "";
      points?: string;
    };
    certificate?: string | File;
  }
}
