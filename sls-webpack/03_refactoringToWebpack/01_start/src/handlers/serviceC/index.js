const aws = require('aws-sdk')
const dynamoDb = new aws.DynamoDB.DocumentClient()

exports.handler = async (event, context) => {
    console.log(dynamoDb)
    return {
        statusCode: 200,
        body: JSON.stringify({
            this: 'works'
        })
    }
}