const action = require('../src/index')

// 1. Import the module in this file     
const toMock = require('../src/codeToMock')
jest.mock('../src/codeToMock')

describe('test', () => {
    // 2. Setup Mock Implementation
    toMock.mockImplementation(() => {
        return 'MOCK'
    })

    test('works', () => {
        const result = action()
        expect(result).toBe('MOCK')
    })
})

