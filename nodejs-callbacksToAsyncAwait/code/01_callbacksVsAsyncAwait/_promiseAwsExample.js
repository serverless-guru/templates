const AWS = require('aws-sdl')
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: process.env.REGION || 'us-east-1'
})

const params = {
    Table: 'my-table',
    keys: {
        PK: 1,
        SK: 'meta'
    }
}

const get = () => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // 1. Example of using the callback version of DynamoDB
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    dynamoDb.get(params, () => {
        dynamoDb.get(params, () => {
            dynamoDb.get(params, () => {

            })
        })
    })


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // 2. Example of using the promise version of DynamoDB
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    dynamoDb.get(params).promise()

}

