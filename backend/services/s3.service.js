const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");

async function uploadFile(file, projectId) {
  const key = `projects/${projectId}/${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  return {
    bucket: process.env.S3_BUCKET_NAME,
    key,
  };
}

module.exports = {
  uploadFile,
};
