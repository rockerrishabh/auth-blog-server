import { Router } from "express";
import { auth } from "../middlewares/auth";
import { createPost } from "../controllers/postController/create";
import { updatePost } from "../controllers/postController/update";
import { deletePost } from "../controllers/postController/delete";
import { fetchAllPost } from "../controllers/postController/fetchAll";
import { singlePost } from "../controllers/postController/singlePost";
import { searchPost } from "../controllers/postController/search";
// import {
//   createPost,
//   deletePost,
//   updatePost,
// } from "../controllers/postController";
// import { middleware } from "../middleware";

export const postRouter = Router();

postRouter.get("/fetchAll", fetchAllPost);
postRouter.get("/:id", singlePost);
postRouter.get("/", searchPost);
postRouter.post("/create", auth, createPost);
postRouter.patch("/update", auth, updatePost);
postRouter.delete("/delete", auth, deletePost);
