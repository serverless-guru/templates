/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Test Scenario:
return coffee price based on:
- the current cost of coffee (external api call)
- day of the week (value that changes over time)
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// BUSINESS LOGIC
const calculatePrice = (day, price) => {
    if (day === 5) {
        return 800
    }

    if (price <= 200) {
        return price
    }

    if (day === 2) {
        return price - 100   
    }

    return price
}

// VALIDATION
const invalidCoffeePrice= result => {
    if (result === 'not working') {
        return 'unavailable price'
    }

    if (!result) {
        return 'unavailable'    
    }

    return false
}


module.exports = async (io) => {
    const result = await io.getCoffeePrice().catch(x => x.message)
    const invalid = invalidCoffeePrice(result)

    if (invalid) {
        return {
            statusCode: 500,
            data: JSON.stringify({
                coffeePrice: invalid
            })
        }
    }

    const day = io.getCurrentDay()

    return {
        statusCode: 200,
        data: JSON.stringify({
            coffeePrice: calculatePrice(day, result)
        })
    }
}