import type { FetchResponseType } from "app-shared";
import type { PersonalInfoType } from "app-personalinfo";
import api from "../../utilities/api";

export const addPerson = async (resumeId: string, data: any) => {
  const res = await api.post<FetchResponseType<PersonalInfoType>>(
    `/resumes/${resumeId}/personal-information`,
    data
  );

  const { success, message, data: person } = res.data;
  return { success, message, person };
};

export const getPersons = async () => {
  const res = await api.get<FetchResponseType<PersonalInfoType[]>>(
    `/admin/personal-informations`
  );

  const { success, message, data } = res.data;
  return { success, message, persons: data };
};

export const getPerson = async (resumeId: string) => {
  const res = await api.get<FetchResponseType<PersonalInfoType>>(
    `/resumes/${resumeId}/personal-information`
  );

  const { success, message, data } = res.data;
  return { success, message, person: data };
};

export const getPersonById = async (id: string) => {
  const res = await api.get<FetchResponseType<PersonalInfoType>>(
    `/admin/personal-informations/${id}`
  );

  const { success, message, data } = res.data;
  return { success, message, person: data };
};

export const editPerson = async (resumeId: string, data: any) => {
  const res = await api.patch<FetchResponseType<PersonalInfoType>>(
    `/resumes/${resumeId}/personal-information`,
    data
  );

  const { success, message, data: person } = res.data;
  return { success, message, person };
};

export const editPersonById = async (id: string) => {
  const res = await api.patch<FetchResponseType<PersonalInfoType>>(
    `/admin/personal-informations/${id}`
  );

  const { success, message, data } = res.data;
  return { success, message, person: data };
};

export const deletePersonById = async (id: string) => {
  const res = await api.delete<FetchResponseType<PersonalInfoType>>(
    `/admin/personal-informations/${id}`
  );

  const { success, message, data } = res.data;
  return { success, message, person: data };
};
