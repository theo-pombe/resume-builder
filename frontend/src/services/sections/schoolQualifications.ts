import type { FetchResponseType } from "app-shared";
import type { SchoolType } from "app-school";
import api from "../../utilities/api";

export const addSchool = async (
  resumeId: string,
  data: FormData,
  signal?: AbortSignal
): Promise<FetchResponseType<SchoolType>> => {
  try {
    const res = await api.post<FetchResponseType<SchoolType>>(
      `/resumes/${resumeId}/school-qualifications`,
      data,
      { signal }
    );

    const { success, message, data: school } = res.data;
    return { success, message, data: school };
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to add school qualification";
    return { success: false, message, errors: err };
  }
};

export const getSchools = async (
  resumeId: string,
  signal?: AbortSignal
): Promise<FetchResponseType<SchoolType[]>> => {
  try {
    const res = await api.get<FetchResponseType<SchoolType[]>>(
      `/resumes/${resumeId}/school-qualifications`,
      { signal }
    );
    const { success, message, data: schools } = res.data;
    return { success, message, data: schools };
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to retrieve school qualifications";
    return { success: false, message, errors: err };
  }
};

export const editSchool = async (
  resumeId: string,
  data: FormData,
  id: string,
  signal?: AbortSignal
): Promise<FetchResponseType<SchoolType>> => {
  try {
    const res = await api.patch<FetchResponseType<SchoolType>>(
      `/resumes/${resumeId}/school-qualifications/${id}`,
      data,
      { signal }
    );
    const { success, message, data: school } = res.data;
    return { success, message, data: school };
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to update school qualification";
    return { success: false, message, errors: err };
  }
};

export const deleteSchool = async (
  resumeId: string,
  id: string,
  signal?: AbortSignal
): Promise<FetchResponseType<null>> => {
  try {
    const res = await api.delete<FetchResponseType<null>>(
      `/resumes/${resumeId}/school-qualifications/${id}`,
      { signal }
    );
    const { success, message } = res.data;
    return { success, message, data: null };
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to delete school qualification";
    return { success: false, message, errors: err };
  }
};
