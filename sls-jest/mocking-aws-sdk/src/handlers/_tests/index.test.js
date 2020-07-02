const AWS = require('aws-sdk');

jest.mock('aws-sdk');

// mock functions
const mockS3GetObject = jest.fn();
const mockS3DeleteObject = jest.fn();

// mock aws-sdk and underlying functions
jest.mock('aws-sdk', () => {
    return {
        S3: jest.fn(() => ({
            getObject: mockS3GetObject,
            deleteObject: mockS3DeleteObject
        }))
    };
});

const index = require('../index');

// test handler function
describe('index.handler() function', () => {
    beforeEach(() => {
        mockS3DeleteObject.mockReset();
        mockS3GetObject.mockReset();

        mockS3DeleteObject.mockImplementation(params => {
            return {
                promise() {
                    return Promise.resolve({ Body: "file deleted" })
                }
            };
        });

        mockS3GetObject.mockImplementation(params => {
            return {
                promise() {
                    return Promise.resolve({ Body: "text file" })
                }
            };
        });
    });

    test("should return response 200", async () => {
        const result = await index.handler({});
        expect(result.statusCode).toBe(200);
    });
    test("should have body.message of hello", async () => {
        const result = await index.handler({});
        let body = JSON.parse(result.body);
        expect(body.message).toBe("hello");
    });
});

// test delete object from s3
describe('index.deleteObjectFromS3() function', () => {
    beforeEach(() => {
        mockS3DeleteObject.mockReset();
        mockS3DeleteObject.mockImplementation(params => {
            return {
                promise() {
                    return Promise.resolve({ Body: "file deleted" })
                }
            };
        });
    });

    test("should mock s3.getObject", async () => {
        expect(await index.deleteObjectFromS3({})).toEqual({ Body: "file deleted" });
    });
});

// test get object from s3
describe('index.getObjectFromS3() function', () => {
    beforeEach(() => {
        mockS3GetObject.mockReset();
    });

    test("should mock s3.getObject", async () => {
        mockS3GetObject.mockImplementation(params => {
            return {
                promise() {
                    return Promise.resolve({ Body: "text file" })
                }
            };
        });
        expect(await index.getObjectFromS3({})).toEqual({ Body: "text file" });
    });
});