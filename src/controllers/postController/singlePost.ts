import { Request, Response } from "express";
import { prisma } from "../../db/prisma";

export const singlePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const fetchSinglePost = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!fetchSinglePost) {
      return res
        .status(404)
        .json({ message: "No Posts found", success: false });
    } else {
      return res.status(200).json({ message: fetchSinglePost, success: true });
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
