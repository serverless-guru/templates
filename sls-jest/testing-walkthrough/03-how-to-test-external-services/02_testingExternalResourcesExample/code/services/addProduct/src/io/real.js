const AWS = require('aws-sdk')

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: process.env.REGION || 'us-east-1'
})


module.exports = {
    create: async data => {
        const params = {
            TableName: data.table,
            Item: {
                PK: data.id,
                name: data.name
            }
        }
        await dynamoDb.put(params).promise()
        
        return {
            id: data.id,
            name: data.name
        }
    }
}