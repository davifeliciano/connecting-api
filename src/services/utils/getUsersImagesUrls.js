import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { client, bucketName } from "../../aws/s3.js";

export default async function getUsersImagesUrls(users) {
  const usersUrlsPromises = [];

  users.forEach((user) => {
    const urlsOptions = { expiresIn: 3600 }; // TODO: Import from config file
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
