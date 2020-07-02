const { addDaysLeft } = require('../index')

describe('addDaysLeft', () => {
    test('will return an array', () => {
        const input = []
        const result = addDaysLeft(input)
        expect(Array.isArray(result)).toBeTruthy()
    })
})