const db = require('../index')
const seeder = require('./utils/seeder')


describe('db', () => {

    beforeAll(async () => {
        await seeder.seed()
    })

    afterAll(async () => {
        await seeder.clearSeededData()
    })
    
    test('can get Pic', async () => {    
       
        const result = await db.getPic('product_1234')        
        expect(result).toEqual({
            pic: {
                url: 'https://google.com',
            },
            picError: false
        })
    })

    test('will error correctly when getting Pic', async () => {    
        const result = await db.getPic()        
        expect(result).toEqual({
            pic: false,
            picError: 'There was a problem getting the picture'
        })
    })

    test('can get Tweet', async () => {    
        const result = await db.getTweet('product_1234')        
        expect(result).toEqual({
            tweet: 'Most Recent Tweet',
            tweetError: false
        })
    })

    test('will error correctly when getting Tweet', async () => {    
        const result = await db.getTweet()        
        expect(result).toEqual({
            tweet: false,
            tweetError: 'There was a problem getting the tweet'
        })
    })

    test('can save Highlighted', async () => {    
        const result = await db.saveHighlighted({
            id: 'product_1234',
            name: 'productName',
            price: 200,
            tweet: 'Tweet Text',
            pic: 'https://pic.com'
        })        
        expect(result).toEqual({
            highlighted: {    
                id: 'product_1234',
                name: 'productName',
                price: 200,
                tweet: 'Tweet Text',
                pic: 'https://pic.com' 
            },
            highlightedError: false
        })
    })

    test('saveHighlighted will error correctly', async () => {    
        const result = await db.saveHighlighted()        
        expect(result).toEqual({
            highlighted: false,
            highlightedError: 'Could not save highlighted'
        })

      
    })
})