const action = require('@YOUR_ORG/starwarscard')
describe('example', () => {
    test('test', () => {
        const x = action({
            name: 'test',
            height: 'height'
        })
        expect(x.name).toBe('test')
    })
})