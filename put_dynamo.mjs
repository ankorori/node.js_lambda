import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const initDynamoClient = () => {
    const marshallOptions = {
        removeUndefinedValues: true,
    };
    const translateConfig = { marshallOptions };
    const DynamoDBclient = new DynamoDBClient({
        region: 'ap-northeast-1'
    });
    
    const dynamo = DynamoDBDocumentClient.from( DynamoDBclient, translateConfig );
    return dynamo;
}

export const dynamoPut = async (dynamo, id, value) => {
    await dynamo.send(
        new PutCommand({
            TableName: "Dynamo_test",
            Item: {
                id: id,
                value: value
            },
        })
    );
}

export const response = (statusCode, body) => {
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT"
        },
        body: JSON.stringify(
            body
        ),
    };
};

export const handler = async (event) => {
    try {
        console.log(event);

        const dynamo = initDynamoClient();
        const body = JSON.parse(event.body);
        const id = event.pathParameters.id;

        console.log("### reqestBody ###:", body);
        dynamoPut(dynamo, id, body.value);
        return response(201, true);
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "PUT"
            },
            body: JSON.stringify({"message": "500err"}),
        };
    }
};
