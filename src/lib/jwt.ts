import jwt from "jsonwebtoken";
import { User as PUser } from "@prisma/client";
import { User } from "../types";

export const generateAccessToken = async (user: User) => {
  const accessToken = await jwt.sign(user, process.env.SECRET!, {
    expiresIn: "24h", // Set the token expiration time
  });
  return btoa(accessToken);
};

export const generateVerificationToken = async (user: User) => {
  const verificationToken = await jwt.sign(user, process.env.SECRET!, {
    expiresIn: "24h", // Set the token expiration time
  });
  return btoa(verificationToken);
};

// Function to generate refresh token
export const generateRefreshToken = async (email: string) => {
  const refreshToken = await jwt.sign({ email }, process.env.SECRET!, {
    expiresIn: "7d", // Set the token expiration time
  });
  return btoa(refreshToken);
};

export const decodeAccessToken = async (token: string) => {
  const decodedBase64 = atob(token);
  const decodeToken = (await jwt.verify(
    decodedBase64,
    process.env.SECRET!
  )) as User & { iat: number; exp: number };
  return decodeToken;
};

export const decodeRefreshToken = async (token: string) => {
  const decodedBase64 = atob(token);
  const decodeToken = (await jwt.verify(
    decodedBase64,
    process.env.SECRET!
  )) as { email: string; iat: number; exp: number };
  return decodeToken;
};

export const decodeVerificationToken = async (token: string) => {
  const decodedBase64 = atob(token);
  const decodeToken = (await jwt.verify(
    decodedBase64,
    process.env.SECRET!
  )) as PUser & {
    iat: number;
    exp: number;
  };
  return decodeToken;
};
