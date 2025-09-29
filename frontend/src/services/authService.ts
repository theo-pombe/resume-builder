import type { LoginType, RegisterType, UserType } from "app-auth";
import api from "../utilities/api";

type LoginResponseType = {
  success: boolean;
  message: string;
  data: {
    user?: UserType;
    token?: string;
  };
};

type RegisterResponseType = {
  success: boolean;
  message: string;
};

export const loginService = async (data: LoginType) => {
  const res = await api.post<LoginResponseType>("/auth/login", data);
  const {
    success,
    message,
    data: { token, user },
  } = res.data;

  if (!success || !token || !user) throw new Error(message || "Login failed");

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return {
    message,
    success,
    user,
  };
};

export const registerService = async (data: RegisterType) => {
  const res = await api.post<RegisterResponseType>("/auth/register", {
    ...data,
    role: "user",
  });
  const { success, message } = res.data;

  if (!success) throw new Error(message || "Registration failed");

  return { success, message };
};

export const logoutService = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
