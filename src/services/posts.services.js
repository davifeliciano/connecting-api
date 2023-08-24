import crypto from "crypto";
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { bucketName, client } from "../aws/s3.js";
import PostsRepository from "../repositories/posts.repository.js";
import editImage from "./utils/editImage.js";
import httpStatus from "http-status";
import NotFoundError from "../errors/NotFoundError.js";
import ConflictError from "../errors/ConflictError.js";

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

  const usersUrlsPromises = [];
  const postsUrlsPromises = [];

  posts.forEach((post) => {
    const urlsOptions = { expiresIn: 3600 };

    if (post.author.filename) {
      const getUserObjectCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: post.author.filename,
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

    const getPostObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: post.filename,
    });

    const postUrlPromise = getSignedUrl(
      client,
      getPostObjectCommand,
      urlsOptions
    );

    postsUrlsPromises.push(postUrlPromise);
  });

  const usersUrlsResults = await Promise.allSettled(usersUrlsPromises);
  const postsUrlsResults = await Promise.allSettled(postsUrlsPromises);

  posts.forEach((post, index) => {
    const userUrlResult = usersUrlsResults[index];
    const postUrlResult = postsUrlsResults[index];

    delete post.author.filename;
    post.author.imageUrl =
      userUrlResult.status === "fulfilled" ? userUrlResult.value : null;

    delete post.filename;
    post.imageUrl =
      postUrlResult.status === "fulfilled" ? postUrlResult.value : null;
  });

  return posts;
}
