import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { bucketName, client } from "../aws/s3.js";
import UsersRepository from "../repositories/users.repository.js";
import editImage from "./utils/editImage.js";
import getUsersImagesUrls from "./utils/getUsersImagesUrls.js";
import NotFoundError from "../errors/NotFoundError.js";
import ConflictError from "../errors/ConflictError.js";
import ForbbidenError from "../errors/ForbbidenError.js";

async function putUserImage(file) {
  if (!file) return;

  const editedImageBuffer = await editImage(file.buffer);
  const uuid = crypto.randomUUID();
  const filename = "avatars/" + uuid + ".webp";

  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: filename,
    Body: editedImageBuffer,
    ContentType: "image/webp",
  });

  await client.send(putCommand);
  return filename;
}

export async function updateUser(userId, name, bio, file) {
  const filename = await putUserImage(file);
  await UsersRepository.update(userId, name, bio, filename);
}

export async function getUserFollowers(userId) {
  const followers = await UsersRepository.getFollowers(userId);

  if (followers.length !== 0) {
    return getUsersImagesUrls(followers);
  }

  const leader = await UsersRepository.findById(userId);

  if (!leader) {
    throw new NotFoundError("User not found");
  }
}

export async function getUserLeaders(userId) {
  const leaders = await UsersRepository.getLeaders(userId);

  if (leaders.length !== 0) {
    return getUsersImagesUrls(leaders);
  }

  const follower = await UsersRepository.findById(userId);

  if (!follower) {
    throw new NotFoundError("User not found");
  }
}

export async function getUserByUsername(userId, username) {
  const user = await UsersRepository.findByUsername(userId, username);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const [userWithImageUrl] = await getUsersImagesUrls([user]);
  return userWithImageUrl;
}

export async function followUser(followerId, leaderId) {
  try {
    await UsersRepository.follow(followerId, leaderId);
  } catch (err) {
    if (err.constraint === "followers_check") {
      throw new ForbbidenError("A user cannot follow himself");
    }

    if (err.constraint === "followers_leader_id_follower_id_key") {
      throw new ConflictError("You already follow this user");
    }

    if (err.constraint === "followers_leader_id_fkey") {
      throw new NotFoundError("User not found");
    }

    throw err;
  }
}

export async function unfollowUser(followerId, leaderId) {
  await UsersRepository.unfollow(followerId, leaderId);
}
