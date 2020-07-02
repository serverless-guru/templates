const AWS = require('aws-sdk')
const table = process.env.TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: process.env.REGION || 'us-east-2'
})

module.exports = {
    get: async id => {
        const params = {
            TableName: table,
            keys: {
                PK: id
            }
        }

        return await dynamoDb.get(params).promise()
    },

    create: async data => {
        const params = {
            TableName: table,
            Item: {
                PK: data.id,
                name: data.name
            }
        }
        
        await dynamoDb.put(params).promise()
        return data
    
    },

    remove: async data => {
        const params = {
            TableName: table,
            Key: {
                PK: data.id
            },
            ReturnValues: 'ALL_OLD'
        }

        const x = await dynamoDb.delete(params).promise()
        return x.data
    }
}