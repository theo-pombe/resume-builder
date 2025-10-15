import type { FetchResponseType } from "app-shared";
import api from "../../utilities/api";
import type { PersonalInfoType } from "app-personalinfo";

export const addPerson = async (resumeId: string, data: any) => {
  const res = await api.post<FetchResponseType<PersonalInfoType>>(
    `resumes/${resumeId}/personal-information`,
    data
  );

  const { success, message, data: person } = res.data;
  return { success, message, person };
};

export const getPerson = async (resumeId: string) => {
  const res = await api.get<FetchResponseType<PersonalInfoType>>(
    `resumes/${resumeId}/personal-information`
  );

  const { success, message, data } = res.data;
  return { success, message, person: data };
};

export const editPerson = async (resumeId: string, data: any) => {
  const res = await api.patch<FetchResponseType<PersonalInfoType>>(
    `resumes/${resumeId}/personal-information`,
    data
  );

  const { success, message, data: person } = res.data;
  return { success, message, person };
};
