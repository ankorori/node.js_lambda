import { DynamoDBDocumentClient, paginateScan } from "@aws-sdk/lib-dynamodb";
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
            convertEmptyValues: false,
            removeUndefinedValues: true,
        };
        const translateConfig = { marshallOptions };
        const DynamoDBclient = new DynamoDBClient({
            region: 'ap-northeast-1'
        });
        const dynamo = DynamoDBDocumentClient.from( DynamoDBclient, translateConfig );
        const paginatorConfig = {
            client: dynamo,
            pageSize: 1,
        };
        
        const paginator = paginateScan(paginatorConfig, {
                TableName: "Dynamo_test",
            }
        );
        const items = {};
        items.items = [];
        let i = 0;
        for await (const page of paginator) {
            items.items[i] = page.Items[0];
            i++;
        }
        items.totalRecordsCount = Object.keys(items.items).length;
        return response(200, event, items);
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
};
