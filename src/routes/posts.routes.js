import { Router } from "express";
import validateAuthentication from "../middlewares/validateAuthentication.js";
import validateBody from "../middlewares/validateBody.js";
import validatePostFile from "../middlewares/validateUploadedFile.js";
import validateId from "../middlewares/validateId.js";
import validateListPostsParams from "../middlewares/validateListPostsParams.js";
import { postSchema } from "../schemas/posts.schemas.js";
import {
  createPostController,
  likePostController,
  listPostsController,
  unlikePostController,
} from "../controllers/posts.controllers.js";

const postsRouter = Router();

postsRouter.use(validateAuthentication);

postsRouter.post(
  "/",
  validatePostFile(true),
  validateBody(postSchema),
  createPostController
);

postsRouter.post("/:id/like", validateId, likePostController);
postsRouter.post("/:id/unlike", validateId, unlikePostController);
postsRouter.get("/", validateListPostsParams, listPostsController);

export default postsRouter;
