const { handler } = require('../handler')
const { ExternalApiError, DatabaseError } = require('../helpers/errors')
const io = require('../io')

jest.mock('../io', () => ({
    api: {
        getAvailableSeating: jest.fn()
    },

    db: {
        addDiscount: jest.fn(),
        findDiscountsByDate: jest.fn()
    }
}))

describe('Handler Errorhandling', () => {
    test('will return 500 if getAvailableSeating api call throws an error', async () => {
        io.api.getAvailableSeating.mockImplementation(() => {
            throw new ExternalApiError('api error')
        })
        io.db.findDiscountsByDate.mockImplementation(() => [])

        const input = {
            body: JSON.stringify({
                id: 1
            })
        }
        const result = await handler(input)
        expect(result.statusCode).toBe(500)
        expect(JSON.parse(result.body)).toEqual({
            message: 'api error'
        })
    })

    test('will return 500 if findDiscountsByDate db call throws an error', async () => {
        io.api.getAvailableSeating.mockImplementation(() => [])
        io.db.findDiscountsByDate.mockImplementation(() => {
            throw new DatabaseError('database error')
        })

        const input = {
            body: JSON.stringify({
                id: 1
            })
        }
        const result = await handler(input)
        expect(result.statusCode).toBe(500)
        expect(JSON.parse(result.body)).toEqual({
            message: 'database error'
        })
    })

    test('will return 500 if there is an error in business logic', async () => {
        io.api.getAvailableSeating.mockImplementation(() => [])
        io.db.findDiscountsByDate.mockImplementation(() => 0)

        const input = {
            body: JSON.stringify({
                id: 1
            })
        }
        const result = await handler(input)
        expect(result.statusCode).toBe(500)
        expect(JSON.parse(result.body)).toEqual({
            message: 'There is a problem on our end, we are on it!'
        })
    })

})