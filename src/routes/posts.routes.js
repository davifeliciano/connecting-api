import { Router } from "express";
import validateAuthentication from "../middlewares/validateAuthentication.js";
import validateBody from "../middlewares/validateBody.js";
import validatePostFile from "../middlewares/validateUploadedFile.js";
import validateParams from "../middlewares/validateParams.js";
import idParamsSchema from "../schemas/common/idParams.schema.js";
import { listPostsQuerySchema, postSchema } from "../schemas/posts.schemas.js";
import {
  createPostController,
  likePostController,
  listPostsController,
  unlikePostController,
} from "../controllers/posts.controllers.js";
import validateQuery from "../middlewares/validateQuery.js";

const postsRouter = Router();

postsRouter.use(validateAuthentication);

postsRouter
  .post(
    "/",
    validatePostFile(true),
    validateBody(postSchema),
    createPostController
  )
  .post("/:id/like", validateParams(idParamsSchema), likePostController)
  .post("/:id/unlike", validateParams(idParamsSchema), unlikePostController)
  .get("/", validateQuery(listPostsQuerySchema), listPostsController);

export default postsRouter;
