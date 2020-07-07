const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

const http = {
    success: x => {
        return {
            statusCode: 200,
            body: JSON.stringify(x),
        }
    },

    validationError: x => {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: x
            }),
        }
    },

    serverError: x => {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: x
            }),
        }
    }
}

const db = {
    addItem: async (data) => {
        const params = {
            TableName: 'myTable',
            Item: {
                PK: 'user_1234',
                SK: data.id,
                name: data.name,
            }
        }

        await dynamoDb.put(params).promise()
        return data

    }
}

module.exports = {
    http,
    db
}