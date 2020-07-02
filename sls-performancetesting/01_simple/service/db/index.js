const AWS = require('aws-sdk')
const table = process.env.TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
})

module.exports = {
    get: async id => {
        const params = {
            TableName: table,
            Key: {
                PK: id
            }
        }

        const x = await dynamoDb.get(params).promise()
        if (!x.Item) {
            return {
                status: 'not available'    
            }
        }
  
        return {
            id: x.Item.PK,
            name: x.Item.name 
        }
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