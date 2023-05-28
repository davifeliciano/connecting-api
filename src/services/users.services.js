import crypto from "crypto";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { bucketName, client } from "../aws/s3.js";
import UsersRepository from "../repositories/users.repository.js";
import editImage from "./utils/editImage.js";

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

export async function updateUser(userId, { name, bio }, file) {
  const filename = await putUserImage(file);
  await UsersRepository.update(userId, name, bio, filename);
}

async function getUsersImagesUrls(users) {
  const usersUrlsPromises = [];

  users.forEach((user) => {
    const urlsOptions = { expiresIn: 3600 };
    const { filename } = user;

    if (filename) {
      const getUserObjectCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: filename,
      });

      const userUrlPromise = getSignedUrl(
        client,
        getUserObjectCommand,
        urlsOptions
      );

      usersUrlsPromises.push(userUrlPromise);
    } else {
      usersUrlsPromises.push(null);
    }
  });

  const usersUrlsResults = await Promise.allSettled(usersUrlsPromises);

  users.forEach((user, index) => {
    const userUrlResult = usersUrlsResults[index];

    delete user.filename;
    user.imageUrl =
      userUrlResult.status === "fulfilled" ? userUrlResult.value : null;
  });

  return users;
}

export async function getUserFollowers(userId) {
  const followers = await UsersRepository.getFollowers(userId);
  return getUsersImagesUrls(followers);
}

export async function getUserLeaders(userId) {
  const leaders = await UsersRepository.getLeaders(userId);
  return getUsersImagesUrls(leaders);
}

export async function getUserByUsername(username) {
  const user = await UsersRepository.findByUsername(username);
  const [userWithImageUrl] = await getUsersImagesUrls([user]);
  return userWithImageUrl;
}
