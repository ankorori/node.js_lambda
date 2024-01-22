import { handler as getItem } from "../get_dynamo.mjs";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

const ddbMock = mockClient(DynamoDBDocumentClient)

describe("handler get item", () => {
    beforeEach(() => {
        ddbMock.reset()
    })

    it("get item test", async () => {
        const event = {
            "pathParameters": {
                "id": "test"
            }
        };
        const expectValue = {
            Item: { id: "test", value: "memo" }
        };
        ddbMock.on(GetCommand).resolves(expectValue)
        const result = await getItem(event)
        expect(result).toEqual({
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET"
            },
            body: JSON.stringify(
                {id:"test",value:"memo"}
            )
        })
    })

    it("item not found test", async () => {
        const event = {
            "pathParameters": {
                "id": "notfoundID"
            }
        };
        const expectValue = {
            Item: undefined
        };
        ddbMock.on(GetCommand).resolves(expectValue)
        const result = await getItem(event)
        expect(result).toEqual({
            statusCode: 404,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET"
            },
            body: JSON.stringify(
                {"message": "not found."}
            ),
        });
    })

    it("handler response test", async () => {
        const event = {
            "pathParameters": {
                "id": "test"
            }
        };
        const expectValue = {
            Item: { id: event.pathParameters.id, value: "memo" }
        };
        ddbMock.on(GetCommand).resolves(expectValue)
        const result = await getItem(event)
        expect(result).toEqual({
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET"
            },
            body: JSON.stringify(
                expectValue.Item
            ),
        });
    })
})

describe("handler get item error test", () => {
    beforeEach(() => {
        ddbMock.reset()
    })

    it("handler error test", async () => {
        const event = {
            "pathParameters": {
                "id": "test"
            }
        };
        const expectValue = "ERR"
        ddbMock.on(GetCommand).rejects(expectValue)
        const result = await getItem(event)
        expect(result).toEqual({
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET"
            },
            body: JSON.stringify(
                {"message": "500err"}
            ),
        });
    })
})