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
                PK: data.PK,
                SK: data.SK,
            }
        }

        return await dynamoDb.get(params).promise()
    },

    list: async data => {
        const params = {
            TableName: table,
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': data.PK,
                ':sk': data.SK
            }
        }

        return await dynamoDb.query(params).promise()
    },

    set: async data => {
        const params = {
            TableName: table,
            Item: data
        }

        await dynamoDb.put(params).promise()
        return data

    },

    remove: async data => {
        const params = {
            TableName: table,
            Key: {
                PK: data.PK,
                SK: data.SK
            },
            ReturnValues: 'ALL_OLD'
        }

        const x = await dynamoDb.delete(params).promise()
        return x.data
    }
}