# Serverless Framework + Jest

## Purpose

This is a walk through of how to use Serverless Framework with Jest and how to mock the `aws-sdk` specifically `AWS S3`. This approach can be replicated for other AWS services such as DynamoDB.

## Setup

* Install - `npm i`

## How to mock AWS S3 with Jest?

1. [Install Dependency](#install-dependency)

2. [Test](#test)

### Install the dependency

1. Install - `npm i --save-dev aws-sdk`

### Test

1. [Create a Jest test for mocking S3().getObject()](#create-a-jest-test-for-mocking-s3().getObject())

2. [Create a Jest test for mocking S3().deleteObject()](#create-a-jest-test-for-mocking-s3().deleteObject())

3. [Create a Jest test for index.handler](#create-a-jest-test-for-index.handler)

4. [Run Jest](#run-jest)

#### Create a Jest test for mocking S3().getObject()

[Mocking Documentation](https://docs.google.com/document/d/11yCfnE22bNZguA3vEtx3NqxVHbCdx0Z8e9oupokGnbk/edit?usp=sharing)

Import the `aws-sdk` and mock it.

```js
const AWS = require('aws-sdk');

jest.mock('aws-sdk');
```

Mock the AWS.S3() functions e.g. `getObject()`.

```js
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
```

Finally import your `index.js` file.

```js
const index = require('../index');
```

Add a test for your `getObjectFromS3()` function.

```js
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
```

Above we are resetting the mock object `beforeEach` test run.

```js
beforeEach(() => {
        mockS3GetObject.mockReset();
    });
```

We define a test called `should mock s3.getObject` then we add a `mockImplementation` which will return a promise with `{ Body: "text file" }`.

```js
mockS3GetObject.mockImplementation(params => {
    return {
        promise() {
            return Promise.resolve({ Body: "text file" })
        }
    };
});
```

This `mockImplementation` allows us to write the following code in our `index.js` file.

```js
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

let index = {};

index.getObjectFromS3 = async params => {
  return await s3.getObject(params).promise();
};

module.exports = index;
```

We are passing `.promise()` to the end of our `s3.getObject(params)` request which is why our `mockImplementation` is returning `promise() {}` above.

Finally we actually call our `index.getObjectFromS3()` function and validate if the mocking worked properly.

```js
expect(await index.getObjectFromS3({})).toEqual({ Body: "text file" });
```

As you can see we are saying call my function and expect the function to equal `{ Body: "text file" }`.

#### Create a Jest test for mocking S3().deleteObject()

[Mocking Documentation](https://docs.google.com/document/d/11yCfnE22bNZguA3vEtx3NqxVHbCdx0Z8e9oupokGnbk/edit?usp=sharing)

Import the `aws-sdk` and mock it.

```js
const AWS = require('aws-sdk');

jest.mock('aws-sdk');
```

Mock the AWS.S3() functions e.g. `getObject()`.

```js
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
```

Finally import your `index.js` file.

```js
const index = require('../index');
```

Add a test for your `deleteObjectFromS3()` function.

```js
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
```

Above we are resetting the mock object `beforeEach` test run and setting the `mockImplementation` beforeEach test. This is due to not needing to modify the response for each test as the `deleteObject` request should be fairly standardized.

```js
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
```

This `mockImplementation` allows us to write the following code in our `index.js` file.

```js
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

let index = {};

index.deleteObjectFromS3 = async params => {
  return await s3.deleteObject(params).promise();
};

module.exports = index;
```

We are passing `.promise()` to the end of our `s3.deleteObject(params)` request which is why our `mockImplementation` is returning `promise() {}` above.

Finally we actually call our `index.deleteObjectFromS3()` function and validate if the mocking worked properly.

```js
test("should mock s3.getObject", async () => {
    expect(await index.deleteObjectFromS3({})).toEqual({ Body: "file deleted" });
});
```

As you can see we are saying call my function and expect the function to equal `{ Body: "file deleted" }`.

```js
expect(await index.getObjectFromS3({})).toEqual({ Body: "file deleted" });
```

#### Create a Jest test for index.handler

This test requires mocking both `deleteObject` and `getObject`.

```js
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
```

As you can see it's very similar to the last two tests. But, the main part to pay attention too is how we are testing only the relevant code for `index.handler`.

```js
test("should return response 200", async () => {
    const result = await index.handler({});
    expect(result.statusCode).toBe(200);
});
test("should have body.message of hello", async () => {
    const result = await index.handler({});
    let body = JSON.parse(result.body);
    expect(body.message).toBe("hello");
});
```

In the first test we check to see if the `result.statusCode` is equal to `200`. In the second test we test to see if the `body.message` is equal to `hello`.

Above both of these tests we are still doing a `mockImplementation` for the underlying `aws-sdk` `s3.getObject()` and `s3.deleteObject()` calls. However, in these tests we only care about the input and output of `index.handler` and not our helper functions (e.g. `index.getObjectFromS3()` and `index.deleteObjectFromS3()`).

#### Run Jest

Now that we have everything setup we can run `npm run jest`.