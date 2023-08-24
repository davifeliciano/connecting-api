import jwt from "jsonwebtoken";
import tokenCookieOptions from "../config/tokenCookieOptions.js";
import httpStatus from "http-status";

export default function validateRefreshToken(req, res, next) {
  try {
    const payload = jwt.verify(
      req.cookies?.token,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );

    res.locals.refreshTokenPayload = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.clearCookie("token", tokenCookieOptions);
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}
