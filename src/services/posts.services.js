import sharp from "sharp";
import crypto from "crypto";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { bucketName, client } from "../aws/s3.js";
import PostsRepository from "../repositories/posts.repository.js";

async function editImage(buffer) {
  const imageSize = 1080;

  const backgroundPromise = sharp(buffer)
    .resize(imageSize, imageSize, {
      fit: "cover",
    })
    .blur(5)
    .modulate({ brightness: 0.5 })
    .png()
    .toBuffer();

  const imagePromise = sharp(buffer)
    .resize(imageSize, imageSize, { fit: "contain", background: "transparent" })
    .png()
    .toBuffer();

  const [background, image] = await Promise.all([
    backgroundPromise,
    imagePromise,
  ]);

  return sharp(background)
    .composite([{ input: image }])
    .withMetadata()
    .webp()
    .toBuffer();
}

export async function createPost(userId, { caption }, file) {
  const editedImageBuffer = await editImage(file.buffer);
  const uuid = crypto.randomUUID();
  const filename = uuid + ".webp";

  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: filename,
    Body: editedImageBuffer,
    ContentType: "image/webp",
  });

  await client.send(putCommand);

  try {
    await PostsRepository.insert(userId, caption, filename);
  } catch (err) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: filename,
    });

    await client.send(deleteCommand);
    throw err;
  }
}
