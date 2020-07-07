const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()
const { DatabaseError } = require('./errors')


module.exports = {
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

    },

    find: async x => {
        try {
            const params = {
                TableName: process.env.TABLE,
                KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
                ExpressionAttributeValues: {
                    ':pk': 'discount',
                    ':sk': getTodaysDate()
                }
            }

            const result = await dynamoDb.query(params).promise()
            return result.Items.map(x => ({
                name: x.name,
                discount: x.discount
            }))
        } catch (e) {
            throw new DatabaseError('Generic DB Error Message')
        }
    }
}
