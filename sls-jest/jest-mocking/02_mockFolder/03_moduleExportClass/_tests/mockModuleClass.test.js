const action = require('../src/index')
jest.mock('../src/codeToMock')

describe('test', () => {
    test('works', () => {
        const result = action()
        expect(result).toBe('MOCK')
    })
})