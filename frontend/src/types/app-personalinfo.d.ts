declare module "app-personalinfo" {
  import type { ResumeType } from "app-resume";

  export type Gender = "male" | "female";

  export type MaritalStatus = "single" | "married" | "divorced" | "widowed";

  export type Disability =
    | "none"
    | "visual"
    | "hearing"
    | "mobility"
    | "cognitive"
    | "other";

  export interface PersonalInfoType {
    id: string;
    resume: string | ResumeType;
    fullName: string;
    gender: Gender;
    dateOfBirth: Date;
    nationality: string;
    placeOfDomicile?: string;
    maritalStatus?: MaritalStatus;
    disabilities: Disability[];
    email: string;
    phone: string;
    physicalAddress: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface PersonalInfoFormDataValues {
    fullName: string;
    dateOfBirth: string | Date;
    gender: Gender | "";
    nationality: string;
    placeOfDomicile: string;
    maritalStatus: MaritalStatus | "";
    disabilities: Disability[];
    phone: string;
    email: string;
    physicalAddress: string;
  }
}
