const AWS = require('aws-sdk')
const table = process.env.TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
})

const main = async () => {
    const params = {
        TableName: 'artilery-simple-service-performance',
        Key: {
            PK: 'product_1234'
        },
        ReturnValues: 'ALL_OLD'
    }

    await dynamoDb.delete(params).promise()
}

main()