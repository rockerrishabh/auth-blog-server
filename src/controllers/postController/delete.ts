import { Request, Response } from "express";
import { prisma } from "../../db/prisma";

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const id = req.user.id;
    if (!id || !postId) {
      return res.status(401).json({
        message: "Not Authorised",
      });
    } else {
      const checkPostWithUserLink = await prisma.post.findUnique({
        where: {
          id: postId,
          autherId: id,
        },
      });
      if (!checkPostWithUserLink) {
        return res
          .status(400)
          .json({ message: "This post doesn't belong to you" });
      } else {
        const deleted = await prisma.post.delete({
          where: {
            id: postId,
          },
        });

        if (!deleted) {
          return res.status(400).json({
            message: `Something went wrong`,
          });
        } else {
          return res.status(200).json({
            message: "Successfully deleted",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  } finally {
    await prisma.$disconnect();
  }
};
