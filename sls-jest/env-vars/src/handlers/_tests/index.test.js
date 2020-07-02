const index = require('../index');

test('check string matches with env var', async () => {
    const result = await index.handler({});
    let body = JSON.parse(result.body);
    // we set the environment variable as xyz and are checking
    // to see if that comes back correctly
    expect(body.message).toBe('API_KEY-xyz');
});