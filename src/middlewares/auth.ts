import { NextFunction, Request, Response } from "express";
import { prisma } from "../db/prisma";
import { decodeAccessToken, decodeRefreshToken } from "../lib/jwt";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send("Unauthorized");
    }
    const accessToken = authHeader.split(" ")[1];

    const refreshToken = req.cookies.token as string;
    if (!accessToken && !refreshToken) {
      return res
        .status(401)
        .json({ message: "Not Authorised", success: false });
    }
    const verifyAccessToken = await decodeAccessToken(accessToken);
    const verifyRefreshToken = await decodeRefreshToken(refreshToken);
    if (!verifyAccessToken && !verifyRefreshToken) {
      return res
        .status(401)
        .json({ message: "Invalid Tokens", success: false });
    }
    const findUser = await prisma.user.findUnique({
      where: {
        id: verifyAccessToken.id,
        email: verifyRefreshToken.email,
      },
    });
    if (!findUser) {
      return res.status(404).json({
        message: "User not found with the provided token",
        success: false,
      });
    }
    const { password, ...user } = findUser;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error,
      success: false,
    });
  } finally {
    await prisma.$disconnect();
  }
};
