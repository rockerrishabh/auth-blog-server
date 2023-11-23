import { Router } from "express";
import { registerUser } from "../controllers/authController/providers/email/registerUser";
import { loginUser } from "../controllers/authController/providers/email/loginUser";
import { verifyUser } from "../controllers/authController/providers/email/verifyUser";
import { logoutUser } from "../controllers/authController/providers/email/logoutUser";
import {
  googleCallback,
  googleLogin,
} from "../controllers/authController/providers/google";
import { Me } from "../controllers/authController/providers/user/me";
import { updateUser } from "../controllers/authController/providers/user/update";
import { deleteUser } from "../controllers/authController/providers/user/delete";
import { auth } from "../middlewares/auth";
import { loginValidation } from "../middlewares/Validation";
import { LoginSchema } from "../utils/ValidationSchemas";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginValidation(LoginSchema), loginUser);
userRouter.get("/logout", auth, logoutUser);
userRouter.get("/verify/:code", verifyUser);
userRouter.patch("/update", auth, updateUser);
userRouter.delete("/delete", auth, deleteUser);
userRouter.get("/me", Me);
userRouter.post("/resendVerificationEmail");
userRouter.get("/google", googleLogin);
userRouter.get("/google/callback", googleCallback);

export { userRouter };
