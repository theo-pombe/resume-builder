declare module "app-shared" {
  export interface FetchResponseType<T = unknown> {
    success: boolean;
    message: string;
    errors?: {
      message: string;
    }[];
    data?: T;
  }
}
