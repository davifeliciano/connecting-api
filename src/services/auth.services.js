import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/users.repository.js";
import UserNotFoundError from "../errors/UserNotFoundError.js";
import BadPasswordError from "../errors/BadPasswordError.js";
import TokensRepository from "../repositories/tokens.repository.js";
import RefreshTokenReuseError from "../errors/RefreshTokenReuseError.js";
import { accessTokenTTL, refreshTokenTTL } from "../config/tokensTTL.js";

const SALT_ROUNDS = 10;

export async function registerUser(
  { name, username, email, password },
  currentRefreshToken
) {
  const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
  await UserRepository.insert(name, username, email, passwordHash);
}

export async function loginUser(
  { emailOrUsername, password },
  currentRefreshToken
) {
  const user = await UserRepository.findByUsernameOrEmail(emailOrUsername);

  if (!user) {
    throw new UserNotFoundError(
      `No user found with username or email ${emailOrUsername}`
    );
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new BadPasswordError(
      `Invalid password for username or email ${emailOrUsername}`
    );
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
  return { accessToken, refreshToken };
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
