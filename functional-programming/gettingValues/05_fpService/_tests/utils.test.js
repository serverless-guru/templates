const U = require('../utils')
describe('utils.get', () => {
    test('will get a nested prop', () => {
        const obj = { address: { zip: '100' } }
        const result = U.path(['address', 'zip'], obj)
        expect(result).toBe('100')
    })

    test('will return null if last value is not present', () => {
        const obj = { address: { phone: '1231231233' } }
        const result = U.path(['address', 'zip'], obj)
        expect(result).toBe(null)
    })

    test('will return null if a value in the middle of the path is not present', () => {
        const obj = { address: { zip: '100' } }
        const result = U.path(['preferences', 'color'], obj)
        expect(result).toBe(null)
    })

})

describe('utils.get involving arrays', () => {
    test('will get a nested prop inside array', () => {
        const obj = {
            profiles: [
                { address: { zip: '100' } },
                { address: { zip: '200' } }
            ]
        }
        const result = U.path(['profiles', 1, 'address', 'zip'], obj)
        expect(result).toBe('200')
    })

    test('will return null if array index is outside range', () => {
        const obj = {
            profiles: [
                { address: { zip: '100' } },
                { address: { zip: '200' } }
            ]
        }
        const result = U.path(['profiles', 5, 'address', 'zip'], obj)
        expect(result).toBe(null)
    })
})