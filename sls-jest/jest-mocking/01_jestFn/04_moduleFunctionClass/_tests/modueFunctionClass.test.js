const action = require('../src/index')
const toMock = require('../src/codeToMock')
jest.mock('../src/codeToMock')

describe('test', () => {
    test('works', () => {

        // 1. Setup Mock Implementation
        toMock.method.mockImplementation(() => {
            return {
                action: () => 'MOCK'
            }
        })

        const result = action()
        expect(result).toBe('MOCK')
    })
})