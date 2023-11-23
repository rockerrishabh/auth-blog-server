import argon2 from "argon2";

export const verifyPassword = async (
  hashedPassword: string,
  plainPassword: string
) => {
  const verify = await argon2.verify(hashedPassword, plainPassword);
  return verify;
};

export const hashPassword = async (plainPassword: string) => {
  const hashed = await argon2.hash(plainPassword);
  return hashed;
};
