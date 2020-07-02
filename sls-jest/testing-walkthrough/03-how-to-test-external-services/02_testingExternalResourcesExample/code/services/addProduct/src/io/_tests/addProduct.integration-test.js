const repo = require('../real')
describe('repo', () => {
    test('create will return input', async () => {
        const input = {
            table: 'db-integration-example-test',
            id: 'product_1234',
            name: 'coffee'
        }

        const product = await repo.create(input)
        expect(product.id).toEqual(input.id)
        expect(product.name).toEqual(input.name)
    })
    test('create will properly throw error', async () => {
        const input = {
            table: 'db-integration-example-test',
            name: 'coffee'
        }
        try {
            await repo.create(input)       
        } catch (e) {
            expect(e.message).toEqual('One or more parameter values were invalid: Missing the key PK in the item')
        }
    })
})
