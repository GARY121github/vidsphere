import AWS from "aws-sdk";
import config from "../conf/config";

const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_KEY,
  region: config.AWS_S3_BUCKET_REGION,
  signatureVersion: "v4",
});

export default s3;
