import { handler } from '../list_dynamo.mjs';

describe('handler', () => {
  test('should return a response with items and totalRecordsCount', async () => {
    const event = {}; // Provide any necessary event data for your test case

    // Mock the DynamoDB client and paginator
    const mockPaginator = jest.fn().mockImplementation(async function* () {
      yield { Items: [{ id: 1, name: 'Item 1' }] };
      yield { Items: [{ id: 2, name: 'Item 2' }] };
    });
    const mockDynamo = {
      scan: jest.fn().mockReturnValue({ promise: mockPaginator }),
    };
    const mockDynamoDBDocumentClient = {
      from: jest.fn().mockReturnValue(mockDynamo),
    };

    // Mock the response function
    const mockResponse = jest.fn();

    // Call the handler function
    const result = await handler(event, mockDynamoDBDocumentClient, mockResponse);

    // Assert the response
    expect(result).toEqual({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET"
      },
      body: JSON.stringify({
        items: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
        totalRecordsCount: 2,
      }),
    });

    // Assert the mock function calls
    expect(mockDynamoDBDocumentClient.from).toHaveBeenCalledWith(mockDynamo, { marshallOptions: { convertEmptyValues: false, removeUndefinedValues: true } });
    expect(mockDynamo.scan).toHaveBeenCalledWith({ TableName: "Dynamo_test" });
    expect(mockResponse).toHaveBeenCalledWith(200, event, {
      items: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
      totalRecordsCount: 2,
    });
  });

  test('should return a 500 error response on error', async () => {
    const event = {}; // Provide any necessary event data for your test case

    // Mock the DynamoDB client and paginator to throw an error
    const mockPaginator = jest.fn().mockImplementation(async function* () {
      throw new Error('Test error');
    });
    const mockDynamo = {
      scan: jest.fn().mockReturnValue({ promise: mockPaginator }),
    };
    const mockDynamoDBDocumentClient = {
      from: jest.fn().mockReturnValue(mockDynamo),
    };

    // Call the handler function
    const result = await handler(event, mockDynamoDBDocumentClient);

    // Assert the response
    expect(result).toEqual({
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET"
      },
      body: JSON.stringify({ message: "500err" }),
    });

    // Assert the mock function calls
    expect(mockDynamoDBDocumentClient.from).toHaveBeenCalledWith(mockDynamo, { marshallOptions: { convertEmptyValues: false, removeUndefinedValues: true } });
    expect(mockDynamo.scan).toHaveBeenCalledWith({ TableName: "Dynamo_test" });
  });
});