import { Router } from "express";
import validateId from "../middlewares/validateId.js";
import validateAuthentication from "../middlewares/validateAuthentication.js";
import validatePostFile from "../middlewares/validateUploadedFile.js";
import validateBody from "../middlewares/validateBody.js";
import { profileSchema } from "../schemas/users.schemas.js";
import {
  getFollowersController,
  getLeadersController,
  followController,
  unfollowController,
  updateController,
} from "../controllers/users.controllers.js";

const usersRouter = Router();

usersRouter.use(validateAuthentication);
usersRouter.get("/:id/followers", validateId, getFollowersController);
usersRouter.get("/:id/following", validateId, getLeadersController);
usersRouter.post("/:id/follow", validateId, followController);
usersRouter.post("/:id/unfollow", validateId, unfollowController);
usersRouter.put(
  "/me",
  validatePostFile(),
  validateBody(profileSchema),
  updateController
);

export default usersRouter;
