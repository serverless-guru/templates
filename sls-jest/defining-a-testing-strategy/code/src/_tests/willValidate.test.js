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
    test('will return 400 error if no id is supplied', async () => {
        const input = {
            name: 'Coffee 1',
            price: 200
        }

        const result = await save({ body: JSON.stringify(input) })

        expect(result.statusCode).toBe(400)
        expect(JSON.parse(result.body).message).toEqual('Must have an id')
    })

    test('will return 400 error if no name is supplied', async () => {
        const input = {
            id: 'product_1234',
            price: 200
        }

        const result = await save({ body: JSON.stringify(input) })

        expect(result.statusCode).toBe(400)
        expect(JSON.parse(result.body).message).toEqual('Must have a name')
    })

    test('will return 400 error if no price is supplied', async () => {
        const input = {
            id: 'product_1234',
            name: 'Coffee 1'
        }

        const result = await save({ body: JSON.stringify(input) })

        expect(result.statusCode).toBe(400)
        expect(JSON.parse(result.body).message).toEqual('Must have a price')
    })
})

