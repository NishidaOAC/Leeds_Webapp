const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION, // Ensure this variable is correctly loaded
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});
exports.uploadToS3 = async (file, customerId) => {
    const s3Key = `customers/${customerId}/${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    await s3Client.send(command);
    return { s3Key, fileName: file.originalname };
};

exports.getPresignedViewUrl = async (s3Key) => {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
    });
    // Link expires in 15 minutes
    return await getSignedUrl(s3Client, command, { expiresIn: 900 });
};