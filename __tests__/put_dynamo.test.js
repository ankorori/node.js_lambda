import { dynamoPut, response, handler } from "../put_dynamo.mjs";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const ddbMock = mockClient(DynamoDBDocumentClient);
beforeEach(() => {
    ddbMock.reset();
});

it("should get user names from the DynamoDB", async () => {
    ddbMock.on(PutCommand).resolves({
        Item: { id: "gvvghbhyvftftfyuy", value: "memo" },
    });
    const names = await dynamoPut(ddbMock, "gvvghbhyvftftfyuy", "memo");
    // expect(names).toStrictEqual(["John"]);
});

test("response", () => {
    expect(response(201, true)).toEqual({
        statusCode: 201,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT"
        },
        body: JSON.stringify(
            true
        ),
    });
});

test("body response json", () => {
    expect(response(200, {"message": "500err"})).toEqual({
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT"
        },
        body: JSON.stringify(
            {"message": "500err"}
        ),
    });
});

test("handler", async () => {
    const event = {
        "body": "{\"value\":\"test\"}",
        "pathParameters": {
            "id": "test"
        }
    };
    const result = await handler(event);
    expect(result).toEqual({
        statusCode: 201,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT"
        },
        body: JSON.stringify(
            true
        ),
    });
});

test("handler body non", async () => {
    const event = {
        "pathParameters": {
            "id": "test"
        }
    };
    const result = await handler(event);
    expect(result).toEqual({
        statusCode: 500,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT"
        },
        body: JSON.stringify(
            {"message": "500err"}
        ),
    });
});

test("handler body value string", async () => {
    const event = {
        "body": "value",
        "pathParameters": {
            "id": "test"
        }
    };
    const result = await handler(event);
    expect(result).toEqual({
        statusCode: 500,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT"
        },
        body: JSON.stringify(
            {"message": "500err"}
        ),
    });
});