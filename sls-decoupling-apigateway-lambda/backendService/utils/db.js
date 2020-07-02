const AWS = require('aws-sdk')
const table = process.env.TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: process.env.REGION || 'us-east-2'
})

module.exports = {
    get: async data => {
        const params = {
            TableName: table,
            Key: {
                PK: data.userId,
                SK: data.pollId
            }
        }

        return await dynamoDb.get(params).promise()
    },

    set: async data => {
        const params = {
            TableName: table,
            Item: {
                PK: data.userId,
                SK: data.pollId,
                status: data.status,
                details: data.details
            }
        }

        await dynamoDb.put(params).promise()
        return data

    },

    remove: async data => {
        const params = {
            TableName: table,
            Key: {
                PK: data.userId,
                SK: data.pollId,
            },
            ReturnValues: 'ALL_OLD'
        }

        const x = await dynamoDb.delete(params).promise()
        return x.data
    }
}