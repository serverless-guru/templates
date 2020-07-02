const { handler } = require('../handler')

describe('Handler Validation', () => {
    test('will return 400 error if no body is present in input', async () => {
        const invalidInput = {}
        const result = await handler(invalidInput)
        expect(result.statusCode).toBe(400)
        expect(JSON.parse(result.body).message).toBe('Body is not defined')
    })

    test('will return 400 error if there is no id', async () => {
        const invalidInput = {
            body: JSON.stringify({
                name: 'Gary'
            })
        }
        const result = await handler(invalidInput)
        expect(result.statusCode).toBe(400)
        expect(JSON.parse(result.body).message).toBe('Id is not defined')
    })
})