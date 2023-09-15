import { Router } from "express";
import validateAuthentication from "../middlewares/validateAuthentication.js";
import validatePostFile from "../middlewares/validateUploadedFile.js";
import validateBody from "../middlewares/validateBody.js";
import {
  profileSchema,
  usernameParamsSchema,
} from "../schemas/users.schemas.js";
import {
  getByUsernameController,
  getFollowersController,
  getLeadersController,
  followController,
  unfollowController,
  updateController,
} from "../controllers/users.controllers.js";
import validateParams from "../middlewares/validateParams.js";
import idParamsSchema from "../schemas/common/idParams.schema.js";

const usersRouter = Router();

const validateId = validateParams(idParamsSchema);

usersRouter
  .use(validateAuthentication)
  .get(
    "/:username",
    validateParams(usernameParamsSchema),
    getByUsernameController
  )
  .get("/:id/followers", validateId, getFollowersController)
  .get("/:id/following", validateId, getLeadersController)
  .post("/:id/follow", validateId, followController)
  .post("/:id/unfollow", validateId, unfollowController)
  .put(
    "/me",
    validatePostFile(),
    validateBody(profileSchema),
    updateController
  );

export default usersRouter;
