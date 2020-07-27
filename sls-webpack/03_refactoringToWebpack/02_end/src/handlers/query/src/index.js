const aws = require('aws-sdk')
const mysql = require('mysql')
const zlib = require('zlib')
const dynamoDb = new aws.DynamoDB.DocumentClient()

exports.handler = async (event, context) => {
    console.log(dynamoDb)
    console.log(mysql)
    console.log(zlib)
    return {
        statusCode: 200,
        body: JSON.stringify({
            this: 'works'
        })
    }
}