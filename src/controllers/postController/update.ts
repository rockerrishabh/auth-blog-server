import { Request, Response } from "express";
import { prisma } from "../../db/prisma";

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { title, content }: { title: string; content: string } = req.body;
    const postId = req.params.id;
    const id = req.user.id;
    if (!id || !postId) {
      return res.status(401).json({
        message: "Not Authorised",
      });
    } else if (!title && !content) {
      return res.status(400).json({
        message: "Please provide title and content.",
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
        const updated = await prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            title,
            content,
          },
        });

        if (!updated) {
          return res.status(400).json({
            message: `Something went wrong`,
          });
        } else {
          return res.status(200).json({
            message: "Successfully updated",
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
