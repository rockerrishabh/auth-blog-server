import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res
      .status(200)
      .json({ message: "Successfully logged out.", success: true });
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
