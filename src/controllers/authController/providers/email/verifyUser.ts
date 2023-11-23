import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import { decodeVerificationToken } from "../../../../lib/jwt";

export const verifyUser = async (req: Request, res: Response) => {
  const code = req.params.code;
  try {
    if (!code) {
      return res.status(401).json({
        message: "UnAuthorized Access",
        success: false,
      });
    }
    const verifiedToken = await decodeVerificationToken(code);
    if (!verifiedToken) {
      return res.status(401).json({
        message: "Invalid Token",
        success: false,
      });
    }
    const findUser = await prisma.user.findUnique({
      where: {
        id: verifiedToken.id,
      },
    });
    if (!findUser) {
      return res.status(401).json({
        message: "No user found with the provided token.",
        success: false,
      });
    }
    if (findUser.verified) {
      return res.status(403).json({
        message: "Account verified already.",
        success: false,
      });
    }
    await prisma.user
      .update({
        where: {
          id: verifiedToken.id,
        },
        data: {
          verified: true,
        },
      })
      .then(async () => {
        res.status(200).json({
          message: "Successfully Verified",
          success: true,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  } finally {
    await prisma.$disconnect();
  }
};
