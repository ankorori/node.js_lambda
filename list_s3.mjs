import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { handler } from './list_dynamo.mjs';

const s3Client = new S3Client({ region: "ap-northeast-1" });

async function getObjectFromS3(bucketName, key) {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key
    });

    try {
        const response = await s3Client.send(command);
        const data = await response.Body.text();
        return data;
    } catch (error) {
        console.error('Error retrieving object from S3:', error);
        throw error;
    }
}

// Usage example:
const bucketName = 'my-s3-bucket';
const key = 'path/to/my-object.txt';

export const handler = async (event) => {
    try {
        const data = await getObjectFromS3(bucketName, key);
        return response(200, event, data);
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET"
            },
            body: JSON.stringify({"message": "500err"}),
        };
    }
}

