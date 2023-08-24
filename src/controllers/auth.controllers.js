import httpStatus from "http-status";
import tokenCookieOptions from "../config/tokenCookieOptions.js";
import { refreshTokenCookieTTL } from "../config/tokensTTL.js";
import TokensRepository from "../repositories/tokens.repository.js";
import {
  loginUser,
  refreshUser,
  registerUser,
} from "../services/auth.services.js";

export async function registerController(req, res) {
  await registerUser(res.locals.body);
  return res.sendStatus(httpStatus.CREATED);
}

export async function loginController(req, res) {
  const { accessToken, refreshToken, name, username } = await loginUser(
    res.locals.body,
    req.cookies?.token
  );

  res.cookie("token", refreshToken, {
    ...tokenCookieOptions,
    maxAge: refreshTokenCookieTTL,
  });

  return res.send({ username, name, token: accessToken });
}

export async function refreshController(req, res) {
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

  return res.send({ username, token: accessToken });
}

export async function logoutController(req, res) {
  await TokensRepository.delete(req.cookies?.token);
  res.clearCookie("token", tokenCookieOptions);
  return res.send();
}
