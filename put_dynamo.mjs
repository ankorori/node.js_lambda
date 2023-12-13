import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
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
        console.log(event);

        const marshallOptions = {
            removeUndefinedValues: true,
        };
        const translateConfig = { marshallOptions };
        const DynamoDBclient = new DynamoDBClient({
            region: 'ap-northeast-1'
        });

        const dynamo = DynamoDBDocumentClient.from( DynamoDBclient, translateConfig );
        const body = JSON.parse(event.body);
        const id = event.pathParameters.id;

        console.log("### reqestBody ###:", body);
        await dynamo.send(
            new PutCommand({
                TableName: "Dynamo_test",
                Item: {
                    id: id,
                    value: body.value
                },
            })
        );
        return response(201, event, true);
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST"
            },
            body: JSON.stringify({"message": "500err"}),
        };
    }
};