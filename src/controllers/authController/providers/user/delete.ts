import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.user.id;
  try {
    const deleted = await prisma.user.delete({
      where: {
        id,
      },
    });
    if (!deleted) {
      return res
        .status(400)
        .json({ message: "Something went wrong", success: false });
    } else {
      return res
        .status(200)
        .json({ message: "Successfully deleted", success: true });
    }
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
