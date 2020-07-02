const domain = require('./domain/index')

module.exports.restFunction = async (event) => {
    const result = await domain.getData()
    return {
        statusCode: 200,
        body: JSON.stringify(result)
    }
}

module.exports.httpFunction = async (event) => {
    const result = await domain.getData()
    return {
        statusCode: 200,
        body: JSON.stringify(result)
    }
}