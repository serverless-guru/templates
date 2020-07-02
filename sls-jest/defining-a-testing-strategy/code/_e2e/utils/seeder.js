const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: process.env.REGION || 'us-east-1'
})

const getDbName = name => `${process.env.SERVICE}-${name}-${process.env.STAGE}`

module.exports = {
    seed: async () => {
        await dynamoDb.put({
            TableName: getDbName('pics'),
            Item: {
                PK: 'product_1234#latest',
                url: 'https://google.com'
            }
        }).promise()

        await dynamoDb.put({
            TableName: getDbName('tweets'),
            Item: {
                PK: 'product_1234#latest',
                tweet: 'Most Recent Tweet'
            }
        }).promise()   
    },

    clearSeededData: async () => {
        await dynamoDb.delete({
            TableName: getDbName('pics'),
            Key: {
                PK: 'product_1234#latest'
            }
        }).promise()

        await dynamoDb.delete({
            TableName: getDbName('tweets'),
            Key: {
                PK: 'product_1234#latest'
            }
        }).promise()   

        await dynamoDb.delete({
            TableName: getDbName('highlighted'),
            Key: {
                PK: 'highlighted'
            }
        }).promise()   
    }
}