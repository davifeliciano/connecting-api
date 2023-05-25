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

authRouter.post("/register", validateBody(registerSchema), registerController);
authRouter.post("/login", validateBody(loginSchema), loginController);
authRouter.post("/refresh", validateRefreshToken, refreshController);
authRouter.post("/logout", logoutController);

export default authRouter;
