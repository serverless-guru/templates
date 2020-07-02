
const AWS = require('aws-sdk')
const table = 'sls-antipatterns-shareddatabase-1-dev'
const dynamoDb = new AWS.DynamoDB.DocumentClient()


module.exports.add = async event => {
  const data = JSON.parse(event.body)

  const params = {
    TableName: table,
    Item: {
      PK: data.id,
      name: data.firstName + data.lastName
    }
  }

  await dynamoDb.put(params).promise()
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Success'
    })
  }
}
