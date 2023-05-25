import { Router } from "express";
import validateId from "../middlewares/validateId.js";
import validateAuthentication from "../middlewares/validateAuthentication.js";
import {
  followController,
  unfollowController,
} from "../controllers/users.controllers.js";

const usersRouter = Router();

usersRouter.post(
  "/:id/follow",
  validateId,
  validateAuthentication,
  followController
);

usersRouter.post(
  "/:id/unfollow",
  validateId,
  validateAuthentication,
  unfollowController
);

export default usersRouter;
