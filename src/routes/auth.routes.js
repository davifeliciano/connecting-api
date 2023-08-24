import { Router } from "express";
import validateBody from "../middlewares/validateBody.js";
import { loginSchema, registerSchema } from "../schemas/auth.schemas.js";
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
} from "../controllers/auth.controllers.js";
import validateRefreshToken from "../middlewares/validateRefreshToken.js";

const authRouter = Router();

authRouter
  .post("/register", validateBody(registerSchema), registerController)
  .post("/login", validateBody(loginSchema), loginController)
  .post("/refresh", validateRefreshToken, refreshController)
  .post("/logout", logoutController);

export default authRouter;
