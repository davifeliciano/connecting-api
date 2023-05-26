import { Router } from "express";
import multer from "multer";
import validateAuthentication from "../middlewares/validateAuthentication.js";
import validateBody from "../middlewares/validateBody.js";
import { postSchema } from "../schemas/posts.schemas.js";
import { createPostController } from "../controllers/posts.controllers.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const postsRouter = Router();

postsRouter.post(
  "/",
  validateAuthentication,
  upload.single("image"),
  validateBody(postSchema),
  createPostController
);

export default postsRouter;
