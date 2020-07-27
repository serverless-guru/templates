const aws = require('aws-sdk')
const mysql = require('mysql')
const dynamoDb = new aws.DynamoDB.DocumentClient()

exports.handler = async (event, context) => {
    console.log(dynamoDb)
    console.log(mysql)
    return {
        statusCode: 200,
        body: JSON.stringify({
            this: 'works'
        })
    }
}