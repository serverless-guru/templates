const setupAppsync = require('./utils/callAppsync')
let callAppsync = null
describe('Products Endpoint', () => {
    beforeAll(() => {
        callAppsync = setupAppsync({
            url: process.env.ENDPOINT
        })
    })

    test('can get products', async () => {
        const result = await callAppsync({
            query: `{
                getProduct(id: "1234") {
                    id
                    name
                }
            }`
        })

        expect(result.data.getProduct).toEqual({
            id: '1234',
            name: 'Dark Coffee'
        })
    })

    test('will error if request is not signed with IAM', async () => {
        const result = await callAppsync({
            query: `{
                getProduct(id: "1234") {
                    id
                    name
                }
            }`
        }, true)

        expect(result.errors[0].message).toBe('Missing Authentication Token')
    })
})