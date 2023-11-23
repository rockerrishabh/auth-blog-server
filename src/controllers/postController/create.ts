import { Request, Response } from "express";
import { prisma } from "../../db/prisma";

export const createPost = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      published,
    }: { title: string; content: string; published?: boolean } = req.body;
    const id = req.user.id;
    if (!id) {
      return res.status(401).json({
        message: "Not Authorised",
        success: false,
      });
    } else if (!title && !content) {
      return res.status(400).json({
        message: "Please provide title and content.",
        success: false,
      });
    } else {
      const findPost = await prisma.post.findUnique({
        where: {
          title,
        },
      });

      if (findPost) {
        return res.status(400).json({
          message: `Post with same title: ${title} already exists. Try again with different title`,
          success: false,
        });
      } else {
        if (published) {
          const newPost = await prisma.post.create({
            data: {
              title,
              content,
              published,
              author: {
                connect: {
                  id: req.user.id,
                },
              },
            },
          });
          if (!newPost) {
            return res.status(400).json({ message: "Something went wrong" });
          } else {
            return res.status(201).json({
              message: "successfylly created",
              success: true,
            });
          }
        } else {
          const newPost = await prisma.post.create({
            data: {
              title,
              content,
              author: {
                connect: {
                  id: req.user.id,
                },
              },
            },
          });
          if (!newPost) {
            return res
              .status(400)
              .json({ message: "Something went wrong", success: false });
          } else {
            return res.status(201).json({
              message: "successfylly created",
              success: true,
            });
          }
        }
      }
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
