const db = require('../index')
const seeder = require('./utils/seeder')


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

    test('can get a user', async () => {   
        await seeder.seed()  

        const result = await db.get('1000')
        
        expect(result).toEqual({
            id: '1000',
            name: 'John Smith'
        })

        await seeder.clearSeededData()   
    })
})