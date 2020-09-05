const aws = require('aws-sdk')
const table = process.env.TABLE
const db = new aws.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
})

module.exports.submit = async event => {
  const data = JSON.parse(event.body)

  const params = {
    TableName: table,
    Item: {
      PK: 'submissions',
      SK: 'sub_' + Date.now(),
      text: data.text
    }
  }

  await db.put(params).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify({
      success: true
    })
  }
}

module.exports.list = async () => {
  const params = {
    TableName: table,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': 'submissions',
      ':sk': 'sub_'
    }
  }

  const x = await db.query(params).promise()
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify({
      list: x.Items
    })
  }
}

