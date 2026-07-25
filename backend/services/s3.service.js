const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = require("../config/s3");

// Upload a file to Amazon S3
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

// Download a file from Amazon S3
async function downloadFile(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  return await s3.send(command);
}

// Delete a file from Amazon S3
async function deleteFile(key) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  await s3.send(command);
}

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
};
