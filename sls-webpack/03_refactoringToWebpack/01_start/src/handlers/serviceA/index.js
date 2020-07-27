const aws = require('aws-sdk')
const dateformat = require('dateformat')
const dynamoDb = new aws.DynamoDB.DocumentClient()

exports.handler = async (event, context) => {
    console.log(dynamoDb)
    console.log(dateformat)
    return {
        statusCode: 200,
        body: JSON.stringify({
            this: 'works'
        })
    }
}