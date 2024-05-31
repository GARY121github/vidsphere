import { S3Client } from "@aws-sdk/client-s3";
import config from "@/conf/config";

const s3 = new S3Client({
  region: config.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
  },
});

export default s3;
