import jwt from "jsonwebtoken";

export default function validateAuthentication(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace(/bearer\s+/gi, "");

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    res.locals.user = user;
  } catch (err) {
    return res.sendStatus(401);
  }

  next();
}
