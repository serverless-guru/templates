const { save } = require('../handler')
const db = require('../db')

const simulateDbScenario = config => {
    db.getPic = jest.fn().mockImplementation(() => {
        return {
            pic: {
                url: 'https://google.com'
            },
            picError: config.getPicError ? 'Img cannot be found' : false
        }
    })

    db.getTweet = jest.fn().mockImplementation(() => {
        return {
            tweet: 'lorem ipsum...',
            tweetError: config.getTweetError ? 'Tweet cannot be found' : false
        }
    })

    db.saveHighlighted = jest.fn().mockImplementation((x) => {
        return {
            highlighted: x,
            highlightedError: config.saveHighlightedError ? 'Could not save highlighted' : false
        }
    })
}

describe('saveHighlighted', () => {
    test('will return 500 error if server cannot get pic', async () => {
        simulateDbScenario({
            getPicError: true,
            getTweetError: false,
            saveHighlightedError: false
        })

        const input = {
            id: 'product_1234',
            name: 'Coffee 1',
            price: 200
        }

        const result = await save({ body: JSON.stringify(input) })

        expect(result.statusCode).toBe(500)
        expect(JSON.parse(result.body).message).toEqual('Img cannot be found')
    })

    test('will save highlighted with default tweet if tweets cannot be found', async () => {
        simulateDbScenario({
            getPicError: false,
            getTweetError: true,
            saveHighlightedError: false
        })

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
            tweet: 'Default tweet message',
            pic: 'https://google.com'
        })
    })

    test('will return 500 error if there is a problem saving', async () => {
        simulateDbScenario({
            getPicError: false,
            getTweetError: false,
            saveHighlightedError: true
        })

        const input = {
            id: 'product_1234',
            name: 'Coffee 1',
            price: 200
        }

        const result = await save({ body: JSON.stringify(input) })

        expect(result.statusCode).toBe(500)
        expect(JSON.parse(result.body).message).toEqual('Could not save highlighted')
    })
})

