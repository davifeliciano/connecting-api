import crypto from "crypto";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
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
