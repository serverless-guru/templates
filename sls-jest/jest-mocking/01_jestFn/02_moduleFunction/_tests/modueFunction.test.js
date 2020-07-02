const action = require('../src/index')
const toMock = require('../src/codeToMock')

describe('test', () => {
    test('works', () => {

        // 1. Setup Mock Implementation
        toMock.method = jest.fn().mockImplementation(() => {
            return 'MOCK'
        })

        const result = action()
        expect(result).toBe('MOCK')
    })
})