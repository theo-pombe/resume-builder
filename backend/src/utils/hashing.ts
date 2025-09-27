import bcrypt from "bcryptjs";

export const doHash = async (password: string, salt: number) => {
  return await bcrypt.hash(password, salt);
};

export const compareHash = async (password: any, hashedPassword: any) => {
  return await bcrypt.compare(password, hashedPassword);
};
