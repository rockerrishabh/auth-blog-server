import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import { hashPassword } from "../../../../utils/passwordUtils";

export const updateUser = async (req: Request, res: Response) => {
  const id = req.user.id;
  const data: { name: string; password: string } = req.body;
  try {
    if (!data) {
      return res
        .status(403)
        .json({ message: "No fields provided to update", success: false });
    }
    const hashedPassword = await hashPassword(data.password);
    await prisma.user
      .update({
        where: {
          id,
        },
        data: {
          name: data.name,
          password: hashedPassword,
        },
      })
      .then((updatedUser) => {
        const { password, ...user } = updatedUser;
        res.status(200).json({ message: user, success: true });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
      success: false,
    });
  } finally {
    await prisma.$disconnect();
  }
};
