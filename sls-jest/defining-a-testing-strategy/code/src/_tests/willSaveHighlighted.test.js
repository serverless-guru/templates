const { save } = require('../handler')
const db = require('../db')

db.getPic = jest.fn().mockImplementation(() => {
    return {
        pic: {
            url: 'https://google.com'
        },
        picError: false
    }
})

db.getTweet = jest.fn().mockImplementation(() => {
    return {
        tweet: 'lorem ipsum...',
        tweetError: false
    }
})

db.saveHighlighted = jest.fn().mockImplementation((x) => {
    return {
        highlighted: x,
        highlightedError: false
    }
})

describe('saveHighlighted', () => {
    test('will return success when saved properly', async () => {
        const input = {
            id: 'product_1234',
            name: 'Coffee 1',
            price: 200
        }

        const result = await save({ body: JSON.stringify(input) })

        expect(result.statusCode).toBe(200)
        expect(JSON.parse(result.body)).toEqual({
            id: 'product_1234',
            name: 'Coffee 1',
            price: 200,
            tweet: 'lorem ipsum...',
            pic: 'https://google.com'
        })
    })
})

