const index = require('../index');

describe("test function", () => {
    test("it should test for 200", async () => {
        let response = await index.handler({});
        expect(response.statusCode).toEqual(200);
    });
    test("it should have a body of test..", async () => {
        let response = await index.handler({});
        expect(response.body).toEqual('test..');
    });
});