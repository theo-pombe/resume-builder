declare module "app-resume" {
  export interface ResumeType {
    id: string;
    user: UserType;
    title: string;
    summary: string;
    avatar?: string;
    displayAvatar?: string;
    declaration?: Declaration;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
}
