const db = require('../index')

describe('db', () => {
    test('can add a user', async () => {        
        const result = await db.create({
            id: '1',
            name: 'Johhn'
        })
        
        expect(result).toEqual({
            id: '1',
            name: 'Johhn'
        })

        await db.remove({id:'1'})
    })
})