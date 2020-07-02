const AWS = require('aws-sdk')
const fetch = require('node-fetch')
const { DatabaseError, ExternalApiError } = require('../helpers/errors')
const dynamoDb = new AWS.DynamoDB.DocumentClient()


const getTodaysDate = () => {
    const today = new Date()
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
}

const api = {
    getAvailableSeating: async (id) => {
        try {
            const res = await fetch('https://jsonplaceholder.typicode.com/todos?userId=' + id)
            const result = await res.json()
            return result.map(x => ({
                id: x.id,
                windowSeat: x.completed,
                firstClass: x.title.includes('lab'),
                cancelled: x.title.includes('qui')
            }))
        } catch (e) {
            throw new ExternalApiError('Generic API Error Message')
        }
    }
}

const db = {
    addDiscount: async (data) => {
        /**
        * Note about Partition Keys in this example:
        *
        * PK is the partition key, which means all discounts will be on the same
        * partition. If you have a very large amount of discounts, you may
        * end up with a hot partition key, in which case a different strategy
        * will have to be taken.
        */
        try {
            const params = {
                TableName: process.env.TABLE,
                Item: {
                    PK: 'discount',
                    SK: getTodaysDate() + '#' + data.name,
                    name: data.name,
                    discount: data.discount
                }
            }

            await dynamoDb.put(params).promise()
            return data
        } catch (e) {
            throw new DatabaseError('Generic DB Error Message')
        }
    },

    findDiscountsByDate: async () => {
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

module.exports = {
    api,
    db
}