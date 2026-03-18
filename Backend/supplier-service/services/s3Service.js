const { S3Client, PutObjectCommand, GetObjectCommand,DeleteObjectCommand } = require('@aws-sdk/client-s3');
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

exports.deleteFile = async (s3Key) => {
    try {
        // Use S3_BUCKET_NAME to match your upload function
        const bucketName = process.env.S3_BUCKET_NAME; 
        
        if (!bucketName || !s3Key) {
            throw new Error("Missing Bucket Name or S3 Key");
        }

        const params = {
            Bucket: bucketName,
            Key: s3Key,
        };

        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
        return { success: true };
    } catch (error) {
        // Detailed logging to see exactly why S3 is rejecting it
        console.error("S3 Delete Detailed Error:", {
            code: error.Code,
            message: error.message,
            region: process.env.AWS_REGION,
            bucket: process.env.S3_BUCKET_NAME
        });
        throw error; // Throw the original error so you can see the 'Code'
    }
};