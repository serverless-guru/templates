const getCoffeePrice = require('../index')


const mockIO = {
    getCurrentDay: () => 1,
    getCoffeePrice: () => new Promise(x => x(600))
}

describe('getCoffeePrice', () => {
    test('exists', async () => {
        const result = await getCoffeePrice(mockIO)
        expect(result).toBeTruthy()
    })

    test('returns 200 http message when successful', async () => {
        const result = await getCoffeePrice(mockIO)
        expect(result.statusCode).toBe(200)
    })

    test('returns 600 when external api responds with price of 600', async () => {
        const result = await getCoffeePrice(mockIO)
        expect(JSON.parse(result.data).coffeePrice).toBe(600)
    })

    test('on tuesdays, coffee price is 1 dollar less than api coffee price response', async () => {
        const mockIO = {
            getCurrentDay: () => 2,
            getCoffeePrice: () => new Promise(x => x(600))
        }
        const result = await getCoffeePrice(mockIO)
        expect(JSON.parse(result.data).coffeePrice).toBe(500)
    })

    test('if coffee price is 200 or below, we will not give a discount', async () => {
        const mockIO = {
            getCurrentDay: () => 2,
            getCoffeePrice: () => new Promise(x => x(200))
        }
    
        const result = await getCoffeePrice(mockIO)
        expect(JSON.parse(result.data).coffeePrice).toBe(200)
    })

    test('will return unavailable price if external api properly gives us an error message', async () => {
        const mockIO = {
            getCurrentDay: () => 2,
            getCoffeePrice: () =>
                new Promise((x, rej) => rej({ message: 'not working' }))
        }
    
        const result = await getCoffeePrice(mockIO)
        expect(JSON.parse(result.data).coffeePrice).toBe('unavailable price')
    })
    
    test('will return unavailable if external api returns null', async () => {
        const mockIO = {
            getCurrentDay: () => 2,
            getCoffeePrice: () => new Promise(x => x(null))
        }
    
        const result = await getCoffeePrice(mockIO)
        expect(JSON.parse(result.data).coffeePrice).toBe('unavailable')
    })

    test('on fridays, we charge 800', async () => {
        const mockIO = {
            getCurrentDay: () => 5,
            getCoffeePrice: () => new Promise(x => x(400))
        }
    
        const result = await getCoffeePrice(mockIO)
        expect(JSON.parse(result.data).coffeePrice).toBe(800)
    })
    
})