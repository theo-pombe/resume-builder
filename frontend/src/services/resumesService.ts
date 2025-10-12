import api from "../utilities/api";
import type { FetchResponseType } from "app-shared";
import type { ResumeType } from "app-resume";

export const createResume = async (data: any) => {
  const res = await api.post<FetchResponseType<ResumeType>>("/resumes", data);

  const { success, message, data: resume } = res.data;
  return { success, messages: [message], resume };
};

export const getResumes = async () => {
  const res = await api.get<FetchResponseType<ResumeType[]>>("/resumes");

  const { success, message, data: resumes } = res.data;
  return { success, messages: [message], resumes };
};

export const getResume = async (id: string) => {
  const res = await api.get<FetchResponseType<ResumeType>>(`/resumes/${id}`);

  const { success, message, data: resume } = res.data;
  return { success, messages: [message], resume };
};

export const updateResume = async (id: string, data: any) => {
  const res = await api.patch<FetchResponseType<ResumeType>>(
    `/resumes/${id}`,
    data
  );

  const { success, message, data: resume } = res.data;
  return { success, messages: [message], resume };
};

export const deleteResume = async (id: string) => {
  const res = await api.delete<FetchResponseType<ResumeType>>(`/resumes/${id}`);

  const { success, message } = res.data;
  return { success, messages: [message] };
};
