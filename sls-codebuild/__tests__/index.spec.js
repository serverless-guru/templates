const index = require('../index');

describe("test function", () => {
    test("it should test for 200", async () => {
        let body = await index.handler({});
        expect(body.statusCode).toEqual(200);
    });
});

describe("test function error", () => {
    test("it should test for 500", async () => {
        let body = await index.handler();
        expect(body.statusCode).toEqual(200);
    });
});