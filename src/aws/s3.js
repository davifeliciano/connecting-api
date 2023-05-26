import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";

dotenv.config();

const bucketName = process.env.S3_BUCKET_NAME;

const client = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
  },
});

export { bucketName, client };
