import tokenCookieOptions from "../config/tokenCookieOptions.js";
import { refreshTokenCookieTTL } from "../config/tokensTTL.js";
import BadPasswordError from "../errors/BadPasswordError.js";
import RefreshTokenReuseError from "../errors/RefreshTokenReuseError.js";
import UserNotFoundError from "../errors/UserNotFoundError.js";
import TokensRepository from "../repositories/tokens.repository.js";
import {
  loginUser,
  refreshUser,
  registerUser,
} from "../services/auth.services.js";

export async function registerController(req, res) {
  try {
    await registerUser(res.locals.body);
    return res.sendStatus(201);
  } catch (err) {
    if (
      err.constraint === "users_username_key" ||
      err.constraint === "users_email_key"
    ) {
      return res.sendStatus(409);
    }

    console.error(err);
    return res.status(500).send(err);
  }
}

export async function loginController(req, res) {
  try {
    const { accessToken, refreshToken } = await loginUser(
      res.locals.body,
      req.cookies?.token
    );

    res.cookie("token", refreshToken, {
      ...tokenCookieOptions,
      maxAge: refreshTokenCookieTTL,
    });

    return res.send({ token: accessToken });
  } catch (err) {
    if (err instanceof UserNotFoundError || err instanceof BadPasswordError) {
      return res.sendStatus(401);
    }

    console.error(err);
    return res.status(500).send(err);
  }
}

export async function refreshController(req, res) {
  try {
    const { id, username } = res.locals.refreshTokenPayload;
    const { accessToken, refreshToken } = await refreshUser(
      id,
      username,
      req.cookies?.token
    );

    res.cookie("token", refreshToken, {
      ...tokenCookieOptions,
      maxAge: refreshTokenCookieTTL,
    });

    return res.send({ token: accessToken });
  } catch (err) {
    if (err instanceof RefreshTokenReuseError) {
      return res.sendStatus(403);
    }

    console.error(err);
    return res.status(500).send(err);
  }
}

export async function logoutController(req, res) {
  try {
    await TokensRepository.delete(req.cookies?.token);
    res.clearCookie("token", tokenCookieOptions);

    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}
