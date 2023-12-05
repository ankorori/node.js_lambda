import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const response = (statusCode, event, body) => {
    const httpMethod = event.httpMethod;
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": httpMethod
        },
        body: JSON.stringify(
            body
        ),
    };
};

export const handler = async (event) => {
    try {
        const marshallOptions = {
            removeUndefinedValues: true,
        };
        const translateConfig = { marshallOptions };
        const DynamoDBclient = new DynamoDBClient({
            region: 'ap-northeast-1'
        });
        const id = event.pathParameters.id;
        const dynamo = DynamoDBDocumentClient.from( DynamoDBclient, translateConfig );
        const dynamo_data = await dynamo.send(
            new GetCommand({
                TableName: "Dynamo_test",
                Key: {
                    id: id,
                },
            })
        );
        if (dynamo_data.Item === undefined) {
            return response(404, event, {"message": "not found."});
        } else {
            return response(200, event, dynamo_data.Item);
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "get"
            },
            body: JSON.stringify({"message": "500err"}),
        };
    }
};
