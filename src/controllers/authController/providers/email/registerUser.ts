import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import { hashPassword } from "../../../../utils/passwordUtils";
import { generateVerificationToken } from "../../../../lib/jwt";
import { sendMail } from "../../../../lib/mailer";
import { verificationMail } from "../../../../lib/mailer/verificationMail";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const body = req.body as { name: string; email: string; password: string };
    const findUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (findUser) {
      return res.status(406).json({
        message: `Your email: ${body.email} is already registered with us. Please Login to your account`,
        success: false,
      });
    }
    const hashedPassword = await hashPassword(body.password);
    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        account: {
          create: {
            providerName: "Email",
          },
        },
      },
    });
    const verificationToken = await generateVerificationToken(newUser);
    await sendMail(verificationMail(newUser.email, verificationToken));
    res
      .status(201)
      .json({ message: "Account created Successfully", success: true });
  } catch (error) {
    console.log(500);
    res.status(500).json({
      message: error,
      success: false,
    });
  } finally {
    await prisma.$disconnect();
  }
};
