const mock = require('./mock')
const real = require('./real')

module.exports = (mockIO = false) => ({
    addProduct: mockIO ? mock : real
})