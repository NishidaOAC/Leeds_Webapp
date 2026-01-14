const AWS = require('aws-sdk');

class S3Client {
  static instance = null;
  static bucketName = null;

  static getInstance() {
    if (!S3Client.instance) {
      AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'ap-south-1'
      });

      S3Client.instance = new AWS.S3({
        apiVersion: '2006-03-01',
        signatureVersion: 'v4'
      });

      S3Client.bucketName = process.env.AWS_BUCKET_NAME || 'your-bucket-name';
    }

    return S3Client.instance;
  }

  static getBucketName() {
    return S3Client.bucketName;
  }
}

module.exports = S3Client;