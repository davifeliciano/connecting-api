import { Router } from "express";
import validateAuthentication from "../middlewares/validateAuthentication.js";
import validateBody from "../middlewares/validateBody.js";
import validatePostFile from "../middlewares/validateUploadedFile.js";
import validateParams from "../middlewares/validateParams.js";
import { idParamsSchema } from "../schemas/common/id.schemas.js";
import { listPostsQuerySchema, postSchema } from "../schemas/posts.schemas.js";
import {
  createPostController,
  getPostByIdController,
  likePostController,
  listPostsController,
  unlikePostController,
} from "../controllers/posts.controllers.js";
import validateQuery from "../middlewares/validateQuery.js";

const postsRouter = Router();

const validateId = validateParams(idParamsSchema);

postsRouter.use(validateAuthentication);

postsRouter
  .post(
    "/",
    validatePostFile(true),
    validateBody(postSchema),
    createPostController
  )
  .post("/:id/like", validateId, likePostController)
  .post("/:id/unlike", validateId, unlikePostController)
  .get("/", validateQuery(listPostsQuerySchema), listPostsController)
  .get("/:id", validateId, getPostByIdController);

export default postsRouter;
