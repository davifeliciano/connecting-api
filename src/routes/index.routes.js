import { Router } from "express";
import authRouter from "./auth.routes.js";
import usersRouter from "./users.routes.js";
import postsRouter from "./posts.routes.js";
import commentsRouter from "./comments.routes.js";

const router = Router();

router
  .use("/auth", authRouter)
  .use("/users", usersRouter)
  .use("/posts", postsRouter)
  .use("/comments", commentsRouter);

export default router;
