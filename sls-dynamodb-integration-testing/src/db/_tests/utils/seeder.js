const AWS = require('aws-sdk')
const table = process.env.TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: process.env.REGION || 'us-east-1'
})

module.exports = {
    seed: async () => {
        const params = {
            TableName: table,
            Item: {
                PK: '1000',
                name: 'John Smith'
            }
        }
        
        await dynamoDb.put(params).promise()
    },

    clearSeededData: async () => {
        const params = {
            TableName: table,
            Key: {
                PK: '1000'
            },
        }

        await dynamoDb.delete(params).promise()
    }
}