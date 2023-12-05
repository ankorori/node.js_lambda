import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
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
        await dynamo.send(
            new DeleteCommand({
                TableName: "Dynamo_test",
                Key: {
                    id: id,
                },
                ConditionExpression: "attribute_exists(id)",
            })
        );
        return response(204, event, true);
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE"
            },
            body: JSON.stringify({"message": "500err"}),
        };
    }
};
