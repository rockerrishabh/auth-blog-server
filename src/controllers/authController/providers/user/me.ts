import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import { decodeRefreshToken, generateAccessToken } from "../../../../lib/jwt";

export const Me = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.token as string;
    if (!refreshToken) {
      return res.status(403).json({
        message: "No refresh token received",
        success: false,
      });
    }
    const verifyToken = (await decodeRefreshToken(refreshToken)) as {
      email: string;
      iat: number;
      exp: number;
    };

    if (!verifyToken) {
      res.clearCookie("token");
      return res.status(401).json({ message: "Invalid Token", success: false });
    }
    const findUser = await prisma.user.findUnique({
      where: {
        email: verifyToken.email,
      },
    });
    if (!findUser) {
      res.clearCookie("token");
      return res.status(404).json({
        message: "No user found with the provided refresh token",
        success: false,
      });
    }
    if (!findUser.verified) {
      res.clearCookie("token");
      return res.status(401).json({
        message: "Your account is not verified yet",
        success: false,
      });
    }
    const { password, ...user } = findUser;
    const accessToken = await generateAccessToken(user);
    res.status(200).json({ message: accessToken, success: true });
  } catch (error) {
    console.log(500);
    res.status(500).json({
      message: error,
      success: false,
    });
  } finally {
    await prisma.$disconnect();
  }
};
