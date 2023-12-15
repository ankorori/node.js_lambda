import { DynamoDBDocumentClient, paginateScan } from "@aws-sdk/lib-dynamodb";
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

const response = (statusCode, body) => {
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        },
        body: JSON.stringify(
            body
        ),
    };
};

export const handler = async (event) => {
    try {
        const dynamo = initDynamoClient();
        const paginatorConfig = {
            client: dynamo,
            pageSize: 10,
        };

        const paginator = paginateScan(paginatorConfig, {
                TableName: "Dynamo_test",
            }
        );
        const items = {};
        let i = 0;
        for await (const page of paginator) {
            items.items = page.Items;
            i++;
        }
        items.totalRecordsCount = Object.keys(items.items).length;
        return response(200, items);
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
