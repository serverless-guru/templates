const { handler } = require('../handler')
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

describe('Handler Logic', () => {
    test('will return 0 seating if no seating is available', async () => {
        io.api.getAvailableSeating.mockImplementation(() => [])
        io.db.findDiscountsByDate.mockImplementation(() => [])

        const input = {
            body: JSON.stringify({
                id: 1
            })
        }
        const result = await handler(input)
        expect(result.statusCode).toBe(200)
        expect(JSON.parse(result.body).availableSeating.length).toBe(0)
    })


    test('will return seatings with discount of 0 if no discounts are available', async () => {
        io.api.getAvailableSeating.mockImplementation(() => [
            {
                id: '1',
                windowSeat: false,
                cancelled: false,
                firstClass: false
            }
        ])

        io.db.findDiscountsByDate.mockImplementation(() => [])

        const input = {
            body: JSON.stringify({
                id: 1
            })
        }
        const result = await handler(input)
        expect(result.statusCode).toBe(200)
        expect(JSON.parse(result.body).availableSeating).toEqual([
            {
                discount: 0,
                id: "1",
                priority: 0,
                isUrgent: true
            }
        ])
    })

    test('will apply discount if discounts are available', async () => {
        io.api.getAvailableSeating.mockImplementation(() => [
            {
                id: '1',
                windowSeat: false,
                cancelled: false,
                firstClass: false
            }
        ])

        io.db.findDiscountsByDate.mockImplementation(() => [
            {
                name: 'TODAYS DISCOUNT',
                discount: 200
            }
        ])

        const input = {
            body: JSON.stringify({
                id: 1
            })
        }
        const result = await handler(input)
        expect(result.statusCode).toBe(200)
        expect(JSON.parse(result.body).availableSeating).toEqual([
            {
                discount: 200,
                id: "1",
                priority: 0,
                isUrgent: true
            }
        ])
    })

    test('will only apply discount if seat is not a window seat', async () => {
        io.api.getAvailableSeating.mockImplementation(() => [
            {
                id: '1',
                windowSeat: false,
                cancelled: false,
                firstClass: false
            },
            {
                id: '2',
                windowSeat: true,
                cancelled: false,
                firstClass: false
            }
        ])

        io.db.findDiscountsByDate.mockImplementation(() => [
            {
                name: 'TODAYS DISCOUNT',
                discount: 200
            }
        ])

        const input = {
            body: JSON.stringify({
                id: 1
            })
        }
        const result = await handler(input)
        expect(result.statusCode).toBe(200)
        expect(JSON.parse(result.body).availableSeating).toEqual([
            {
                discount: 200,
                id: "1",
                priority: 0,
                isUrgent: true
            },
            {
                discount: 0,
                id: "2",
                priority: 0,
                isUrgent: true
            }
        ])
    })

    test('will apply all discounts if multiple discounts are found', async () => {
        io.api.getAvailableSeating.mockImplementation(() => [
            {
                id: '1',
                windowSeat: false,
                cancelled: false,
                firstClass: false
            }
        ])

        io.db.findDiscountsByDate.mockImplementation(() => [
            {
                name: 'TODAYS DISCOUNT',
                discount: 200
            },
            {
                name: 'TODAYS DISCOUNT 2',
                discount: 500
            }
        ])

        const input = {
            body: JSON.stringify({
                id: 1
            })
        }
        const result = await handler(input)
        expect(result.statusCode).toBe(200)
        expect(JSON.parse(result.body).availableSeating).toEqual([
            {
                discount: 700,
                id: "1",
                priority: 0,
                isUrgent: true
            }
        ])
    })

    test('will give seat a priority of 1 if it was previously bought but cancelled', async () => {
        io.api.getAvailableSeating.mockImplementation(() => [
            {
                id: '1',
                windowSeat: false,
                cancelled: true,
                firstClass: false
            }
        ])

        io.db.findDiscountsByDate.mockImplementation(() => [])

        const input = {
            body: JSON.stringify({
                id: 1
            })
        }
        const result = await handler(input)
        expect(result.statusCode).toBe(200)
        expect(JSON.parse(result.body).availableSeating).toEqual([
            {
                discount: 0,
                id: "1",
                priority: 1,
                isUrgent: true
            }
        ])
    })

    test('will give seat a priority of 1 if it is firstClass', async () => {
        io.api.getAvailableSeating.mockImplementation(() => [
            {
                id: '1',
                windowSeat: false,
                cancelled: false,
                firstClass: true
            }
        ])

        io.db.findDiscountsByDate.mockImplementation(() => [])

        const input = {
            body: JSON.stringify({
                id: 1
            })
        }
        const result = await handler(input)
        expect(result.statusCode).toBe(200)
        expect(JSON.parse(result.body).availableSeating).toEqual([
            {
                discount: 0,
                id: "1",
                priority: 1,
                isUrgent: true
            }
        ])
    })

    test('will give seat a priority of 2 if it is firstClass and was previously bought but cancelled', async () => {
        io.api.getAvailableSeating.mockImplementation(() => [
            {
                id: '1',
                windowSeat: false,
                cancelled: true,
                firstClass: true
            }
        ])

        io.db.findDiscountsByDate.mockImplementation(() => [])

        const input = {
            body: JSON.stringify({
                id: 1
            })
        }
        const result = await handler(input)
        expect(result.statusCode).toBe(200)
        expect(JSON.parse(result.body).availableSeating).toEqual([
            {
                discount: 0,
                id: "1",
                priority: 2,
                isUrgent: true
            }
        ])
    })

    test('will not be urgent if there are more than 5 available spots', async () => {
        const arrayOfSix = Array.from({ length: 6 })
        io.api.getAvailableSeating.mockImplementation(() => arrayOfSix.map(() => {
            return {
                id: '1',
                windowSeat: false,
                cancelled: true,
                firstClass: true
            }
        }))

        io.db.findDiscountsByDate.mockImplementation(() => [])

        const input = {
            body: JSON.stringify({
                id: 1
            })
        }
        const result = await handler(input)
        expect(result.statusCode).toBe(200)
        expect(JSON.parse(result.body).availableSeating[0]).toEqual({
            discount: 0,
            id: "1",
            priority: 2,
            isUrgent: false
        })
    })
})


