const handler = require('../index')

describe('callbackWithError', () => {
    test('will first run the test, then run it a second time with error', (done) => {
        handler.callbackWithError((x) => {
            try {
                console.log('Test is run')
                expect(x.data).toBeTruthy()
                expect(x.data).toBe(1)
                done()
            } catch (e) {
                done(e)
            }

        })
    })
})

describe('async function', () => {
    test.skip('will first run the test, then run it a second time with error', async () => {
        const result = await handler.asyncAwaitFunction()
        expect(result.data).toBeTruthy()
        expect(result.data).toBe(1)
    })
})