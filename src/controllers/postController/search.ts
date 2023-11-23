import { Request, Response } from "express";
import { prisma } from "../../db/prisma";

export const searchPost = async (req: Request, res: Response) => {
  try {
    const { search }: { search?: string } = req.query;
    if (!search) {
      return res.status(400).json({
        message: "Please provide search string.",
        success: false,
      });
    } else {
      const findPosts = await prisma.post.findMany({
        where: {
          OR: [
            {
              title: {
                contains: search,
              },
              published: true,
            },
            {
              content: {
                contains: search,
              },
              published: true,
            },
          ],
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });
      if (!findPosts) {
        return res.status(404).json({
          message: `Posts not found`,
          success: false,
        });
      }
      return res.status(200).json({
        message: findPosts,
        success: true,
      });
    }
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
