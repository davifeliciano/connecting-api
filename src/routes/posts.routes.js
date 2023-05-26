import { Router } from "express";
import multer from "multer";
import validateAuthentication from "../middlewares/validateAuthentication.js";
import validateBody from "../middlewares/validateBody.js";
import validateId from "../middlewares/validateId.js";
import { postSchema } from "../schemas/posts.schemas.js";
import {
  createPostController,
  likePostController,
  unlikePostController,
} from "../controllers/posts.controllers.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const postsRouter = Router();

postsRouter.use(validateAuthentication);
postsRouter.post(
  "/",
  upload.single("image"),
  validateBody(postSchema),
  createPostController
);

postsRouter.post("/:id/like", validateId, likePostController);
postsRouter.post("/:id/unlike", validateId, unlikePostController);

export default postsRouter;
