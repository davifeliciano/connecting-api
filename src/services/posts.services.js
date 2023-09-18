import crypto from "crypto";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { bucketName, client } from "../aws/s3.js";
import PostsRepository from "../repositories/posts.repository.js";
import editImage from "./utils/editImage.js";
import httpStatus from "http-status";
import NotFoundError from "../errors/NotFoundError.js";
import ConflictError from "../errors/ConflictError.js";
import getPostsImagesUrls from "./utils/getPostsImagesUrls.js";

export async function createPost(userId, caption, file) {
  const editedImageBuffer = await editImage(file.buffer);
  const uuid = crypto.randomUUID();
  const filename = "posts/" + uuid + ".webp";

  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: filename,
    Body: editedImageBuffer,
    ContentType: "image/webp",
  });

  try {
    await client.send(putCommand);
    await PostsRepository.insert(userId, caption, filename);
  } catch (err) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: filename,
    });

    await client.send(deleteCommand);

    if (err.constraint === "posts_author_fkey") {
      return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
    }

    throw err;
  }
}

export async function likePost(userId, postId) {
  try {
    await PostsRepository.like(userId, postId);
  } catch (err) {
    if (err.constraint === "post_likes_post_id_fkey") {
      throw new NotFoundError("Post not found");
    }

    if (err.constraint === "post_likes_author_post_id_key") {
      throw new ConflictError("Post already liked");
    }
  }
}

export async function unlikePost(userId, postId) {
  await PostsRepository.unlike(userId, postId);
}

export async function listPosts(userId, options) {
  const posts = await PostsRepository.list(userId, options);
  const postsWithImagesUrls = await getPostsImagesUrls(posts);
  return postsWithImagesUrls;
}

export async function getPostById(userId, postId) {
  const post = await PostsRepository.getById(userId, postId);

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  const [postWithImagesUrls] = await getPostsImagesUrls([post]);
  return postWithImagesUrls;
}
