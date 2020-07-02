const threeLevels = require('../threeLevelsWithError')
describe('threeLevels', () => {
    test('useCallback will execute with callback', (done) => {
        threeLevels.useCallback(1, (x) => {
            expect(x).toEqual('ERROR')
            done()
        })
    })

    test('usePromiseWithThen will execute with callback', (done) => {
        threeLevels.usePromiseWithThen(1, (x) => {
            expect(x).toEqual('ERROR')
            done()
        })
    })

    test('usePromiseWithPromiseAll will execute with callback', (done) => {
        threeLevels.usePromiseWithPromisAll(1, (x) => {
            expect(x).toEqual('ERROR')
            done()
        })
    })

    test('usePromiseWithAsync will return with async function', async () => {
        const result = await threeLevels.usePromiseWithAsync(1)
        expect(result).toEqual('ERROR')
    })
})
