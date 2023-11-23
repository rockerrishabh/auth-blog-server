import { Request, Response } from "express";
import axios from "axios";
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
} from "../../../../lib/jwt";
import { prisma } from "../../../../db/prisma";
import { sendMail } from "../../../../lib/mailer";
import { verificationMail } from "../../../../lib/mailer/verificationMail";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectURL = "http://localhost:3000/api/user/google/callback";
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const authorizationURL = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectURL}&access_type=offline&prompt=consent&response_type=code&scope=openid%20email`;
    res.redirect(authorizationURL);
  } catch (error) {
    res.status(500).json({
      message: "Successfully Verified",
      success: false,
    });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token as string;
    if (token) {
      return res.status(400).json({
        message: `You are logged in bad request`,
        success: false,
      });
    }
    const authorizationCode = req.query.code as string;
    if (!authorizationCode) {
      return res
        .status(401)
        .json({ message: "UnAuthorised token", success: false });
    }
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectURL,
        code: authorizationCode,
      }
    );
    if (tokenResponse.status !== 200) {
      return res.status(401).json({ message: "Code Expired", success: false });
    }
    const googleAccessToken: string = tokenResponse.data.access_token;
    const googleRefreshToken: string = tokenResponse.data.refresh_token;
    const profileResponse = await axios.get(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      }
    );
    if (profileResponse.status !== 200) {
      return res
        .status(404)
        .json({ message: "UnAuthorised Code", success: false });
    }
    const profile = profileResponse.data as {
      id: string;
      email: string;
      verified_email: boolean;
      name?: string;
      picture?: string;
    };
    const findUser = await prisma.user.findUnique({
      where: {
        email: profile.email,
      },
    });
    if (!findUser) {
      const newUser = await prisma.user.create({
        data: {
          name: profile.name ? profile.name : profile.email,
          email: profile.email,
          profileImage: profile.picture ? profile.picture : null,
          account: {
            create: {
              providerName: "Google",
            },
          },
        },
      });
      const verificationToken = await generateVerificationToken(newUser);

      await sendMail(verificationMail(newUser.email, verificationToken)).catch(
        console.error
      );
      return res
        .status(201)
        .json({ message: "Account created successfully.", success: true });
    }
    if (!findUser.verified) {
      return res.status(401).json({
        message: "Your account is not verified yet.",
        success: false,
      });
    }
    if (!findUser.profileImage) {
      await prisma.user.update({
        where: {
          id: findUser.id,
        },
        data: {
          profileImage: profile.picture,
        },
      });
    }
    const today = new Date();
    const sevenDaysFromNow = new Date(today.setDate(today.getDate() + 7));
    const { password, ...user } = findUser;
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.email);
    res.cookie("token", refreshToken, {
      httpOnly: true,
      expires: sevenDaysFromNow,
    });
    res.status(200).json({ message: accessToken, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error, success: false });
  } finally {
    await prisma.$disconnect();
  }
};
