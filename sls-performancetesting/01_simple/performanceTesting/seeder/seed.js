const AWS = require('aws-sdk')
const table = process.env.TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
})

const main = async () => {
    const params = {
        TableName: 'artilery-simple-service-performance',
        Item: {
            PK: 'product_1234',
            name: 'Dark Coffee'
        }
    }
    
    await dynamoDb.put(params).promise()
    return true
}

main()

  