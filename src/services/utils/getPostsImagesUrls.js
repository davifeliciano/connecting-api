import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { client, bucketName } from "../../aws/s3.js";

export default async function getPostsImagesUrls(posts) {
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
