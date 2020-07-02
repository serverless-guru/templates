const { addDaysLeft } = require('../index')

const makeFutureDate = days => {
    let date = new Date();
    date.setDate(date.getDate() + days)
    return date
}

describe('addDaysLeft', () => {
    test('will return an array', () => {
        const input = []
        const result = addDaysLeft(input)
        expect(Array.isArray(result)).toBeTruthy()
    })

    test('will add daysLeft property to array', () => {
        const input = [
            {
                startDate: makeFutureDate(4) 
            }
        ]

        const result = addDaysLeft(input)  
        expect(result[0].daysLeft).toBeTruthy()
    })

    test('will calcualte daysLeft based on todays date and items start date', () => {
        const input = [
            {
                startDate: makeFutureDate(7)
            }
        ]

        const result = addDaysLeft(input)  
        expect(result[0].daysLeft).toBe(7)
    })

    test('will return NA if startDate is null', () => {
        const input = [
            {}
        ]

        const result = addDaysLeft(input)  
        expect(result[0].daysLeft).toBe('NA')
    })
})