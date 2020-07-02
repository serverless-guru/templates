const oneLevel = require('../oneLevel')
describe('onLevel', () => {
    test('useCallback will execute with callback', (done) => {
        oneLevel.useCallback(1, (x) => {
            expect(x).toEqual({
                "id": 1,
                "name": "John Smith",
                "tripsTaken": 20
            })
            done()
        })
    })

    test('usePromiseWithThen will execute with callback', (done) => {
        oneLevel.usePromiseWithThen(1, (x) => {
            expect(x).toEqual({
                "id": 1,
                "name": "John Smith",
                "tripsTaken": 20
            })
            done()
        })
    })

    test('usePromiseWithAsync will return with async function', async () => {
        const result = await oneLevel.usePromiseWithAsync(1)
        expect(result).toEqual({
            "id": 1,
            "name": "John Smith",
            "tripsTaken": 20
        })
    })
})
