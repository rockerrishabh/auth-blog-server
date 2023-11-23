import express, { Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import { userRouter } from "./router/userRouter";
import { postRouter } from "./router/postRouter";
import cookieParser from "cookie-parser";
import { User } from "./types";
config();

const app = express();

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

app.set("port", process.env.PORT || 5000);
app.use(
  cookieParser(),
  express.json(),
  express.urlencoded({ extended: true }),
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:4173"],
  })
);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

// Start the server
app.listen(app.get("port"), () => {
  console.log(`Server listening on port ${app.get("port")}`);
});
