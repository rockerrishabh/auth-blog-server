import { Request, Response } from "express";
import { prisma } from "../../db/prisma";

export const fetchAllPost = async (req: Request, res: Response) => {
  try {
    const findAllPosts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    });
    if (!findAllPosts) {
      return res
        .status(404)
        .json({ message: "No Posts found", success: false });
    } else {
      return res.status(200).json({ message: findAllPosts, success: true });
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
