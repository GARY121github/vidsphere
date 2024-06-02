import { S3Client } from "@aws-sdk/client-s3";
import config from "@/conf/config";

/*
The SDK automatically detects AWS credentials set as variables in your environment and uses them for SDK requests, eliminating the need to manage credentials in your application. The environment variables that you set to provide your credentials are:

AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_SESSION_TOKEN
*/

const s3 = new S3Client({
  region: config.AWS_S3_BUCKET_REGION,
});

export default s3;
