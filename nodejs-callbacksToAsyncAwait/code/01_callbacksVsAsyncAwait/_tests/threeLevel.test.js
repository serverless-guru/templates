const threeLevels = require('../threeLevels')
describe('threeLevels', () => {
    test('useCallback will execute with callback', (done) => {
        threeLevels.useCallback(1, (x) => {
            expect(x).toEqual({
                "id": 1,
                "name": "John Smith",
                "tripsTaken": 20
            })
            done()
        })
    })

    test('usePromiseWithThen will execute with callback', (done) => {
        threeLevels.usePromiseWithThen(1, (x) => {
            expect(x).toEqual({
                "id": 1,
                "name": "John Smith",
                "tripsTaken": 20
            })
            done()
        })
    })

    test('usePromiseWithPromiseAll will execute with callback', (done) => {
        threeLevels.usePromiseWithPromisAll(1, (x) => {
            expect(x).toEqual({
                "id": 1,
                "name": "John Smith",
                "tripsTaken": 20
            })
            done()
        })
    })

    test('usePromiseWithAsync will return with async function', async () => {
        const result = await threeLevels.usePromiseWithAsync(1)
        expect(result).toEqual({
            "id": 1,
            "name": "John Smith",
            "tripsTaken": 20
        })
    })
})
