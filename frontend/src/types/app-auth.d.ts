declare module "app-auth" {
  type UserRoles = "user" | "admin";

  export interface UserType {
    id: string;
    username: string;
    role: UserRoles;
    email: string;
    avatar?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface RegisterType {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  export interface LoginType {
    usernameOrEmail: string;
    password: string;
  }
}
