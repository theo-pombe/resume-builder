import type { LoginType, RegisterType, UserType } from "app-auth";
import { createContext, useState } from "react";
import {
  loginService,
  logoutService,
  registerService,
} from "../services/authService";

type AuthContextProps = {
  user?: UserType;
  loading: boolean;
  register: (data: RegisterType) => Promise<{
    success: true;
    message: string;
  }>;
  login: (data: LoginType) => Promise<{
    success: true;
    message: string;
    user: UserType;
  }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const getUserFromStorage = (): UserType | undefined => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : undefined;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | undefined>(getUserFromStorage());
  const [loading, setLoading] = useState(false);

  const login = async (data: LoginType) => {
    setLoading(true);
    try {
      const { success, message, user: loggedInUser } = await loginService(data);
      setUser(loggedInUser);
      return { success, message, user: loggedInUser };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterType) => {
    setLoading(true);
    try {
      const { success, message } = await registerService(data);
      return { success, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutService();
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
