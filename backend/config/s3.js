const { S3Client } = require("@aws-sdk/client-s3");

console.log("AWS_REGION =", process.env.AWS_REGION);
console.log("S3_BUCKET_NAME =", process.env.S3_BUCKET_NAME);

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

module.exports = s3;
