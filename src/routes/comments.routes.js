import { Router } from "express";
import validateAuthentication from "../middlewares/validateAuthentication.js";
import validateBody from "../middlewares/validateBody.js";
import {
  commentSchema,
  listCommentsQuerySchema,
} from "../schemas/comments.schemas.js";
import {
  createCommentController,
  listCommentsController,
} from "../controllers/comments.controllers.js";
import validateQuery from "../middlewares/validateQuery.js";

const commentsRouter = Router();

commentsRouter.use(validateAuthentication);

commentsRouter
  .post("/", validateBody(commentSchema), createCommentController)
  .get("/", validateQuery(listCommentsQuerySchema), listCommentsController);

export default commentsRouter;
