const oneLevel = require('../oneLevelWithError')
describe('onLevel', () => {
    test('useCallback will execute with callback', (done) => {
        oneLevel.useCallback(1, (x) => {
            expect(x).toEqual('ERROR')
            done()
        })
    })

    test('usePromiseWithThen will execute with callback', (done) => {
        oneLevel.usePromiseWithThen(1, (x) => {
            expect(x).toEqual('ERROR')
            done()
        })
    })

    test('usePromiseWithAsync will return with async function', async () => {
        const result = await oneLevel.usePromiseWithAsync(1)
        expect(result).toEqual('ERROR')
    })
})
