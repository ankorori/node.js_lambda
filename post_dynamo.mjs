import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const response = (statusCode, body) => {
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST"
        },
        body: JSON.stringify(
            body
        ),
    };
};

function createId () {
    const str = "0123456789abcdefghijklmnopqrstuvwxyz";
    const Length = 32;
    let rundomId = "";
    for (let i = 0; i < Length; i++) {
        let selected = Math.floor(Math.random() * str.length);
        rundomId += str.substring(selected, selected + 1);
    }
    return rundomId;
}

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
        const id = createId();
        console.log(id);

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
        return response(201, true);
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
