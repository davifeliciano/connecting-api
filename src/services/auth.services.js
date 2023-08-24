import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsersRepository from "../repositories/users.repository.js";
import ConflictError from "../errors/ConflictError.js";
import TokensRepository from "../repositories/tokens.repository.js";
import RefreshTokenReuseError from "../errors/RefreshTokenReuseError.js";
import { accessTokenTTL, refreshTokenTTL } from "../config/tokensTTL.js";
import LoginError from "../errors/LoginError.js";

const SALT_ROUNDS = 10;

export async function registerUser({ name, username, email, password }) {
  const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

  try {
    await UsersRepository.insert(name, username, email, passwordHash);
  } catch (err) {
    if (err.constraint === "users_email_key") {
      throw new ConflictError(
        "There is already an user registered with this email"
      );
    }

    if (err.constraint === "users_username_key") {
      throw new ConflictError(
        "There is already an user registered with this username"
      );
    }

    throw err;
  }
}

export async function loginUser(
  { emailOrUsername, password },
  currentRefreshToken
) {
  const user = await UsersRepository.findByUsernameOrEmail(emailOrUsername);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new LoginError(`Authentication failed for user ${emailOrUsername}`);
  }

  if (currentRefreshToken) {
    const deletedCount = await TokensRepository.clearIfReused(
      user.id,
      currentRefreshToken
    );

    if (deletedCount !== 0) {
      console.log(
        `Attempted reuse of refresh token for username or email ${emailOrUsername}`
      );
    }
  }

  const payload = { id: user.id, username: user.username };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: accessTokenTTL,
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: refreshTokenTTL,
  });

  await TokensRepository.insert(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    name: user.name,
    username: user.username,
  };
}

export async function refreshUser(id, username, currentRefreshToken) {
  const deletedCount = await TokensRepository.clearIfReused(
    id,
    currentRefreshToken
  );

  if (deletedCount !== 0) {
    throw new RefreshTokenReuseError(
      `Attempted reuse of refresh token for username ${username}`
    );
  }

  const payload = { id, username };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: accessTokenTTL,
  });

  const newRefreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: refreshTokenTTL,
    }
  );

  await TokensRepository.update(currentRefreshToken, newRefreshToken);
  return { accessToken, refreshToken: newRefreshToken };
}
