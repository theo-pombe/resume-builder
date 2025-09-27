import bcrypt from "bcryptjs";

export const doHash = async (password: string, salt: number) => {
  return await bcrypt.hash(password, salt);
};
