declare module "app-auth" {
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
