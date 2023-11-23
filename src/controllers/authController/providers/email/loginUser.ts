import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import { verifyPassword } from "../../../../utils/passwordUtils";
import { generateAccessToken, generateRefreshToken } from "../../../../lib/jwt";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token as string;
    if (token) {
      return res.status(400).json({
        message: `You are logged in bad request`,
        success: false,
      });
    }
    const body = req.body as { email: string; password: string };
    const findUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!findUser) {
      return res.status(404).json({
        message: `Your email: ${body.email} is not registered with us. Please Register first to login`,
        success: false,
      });
    } else if (!findUser.password) {
      return res.status(406).json({
        message:
          "You used different provider for registering. Use different provider.",
        success: false,
      });
    }
    if (!findUser.verified) {
      return res.status(401).json({
        message: "Your account is not verified yet",
        success: false,
      });
    }
    const verifiedPassword = await verifyPassword(
      findUser.password,
      body.password
    );
    if (!verifiedPassword) {
      return res.status(401).json({
        message:
          "Your password does not match with our records. Please try again with correct password.",
        success: false,
      });
    }
    const { password, ...user } = findUser;
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.email);
    res.cookie("token", refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    res.status(200).json({
      message: accessToken,
      success: true,
    });
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
