'use strict'

const log = require('lambda-log')
const AWS = require('aws-sdk')
const doc = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true })

const commentsTable = process.env.COMMENTS_TABLE

module.exports.handler = async (event) => {
  log.info('Event', { event })

  if (!event || !event.requestContext || !event.requestContext.http || !event.requestContext.http.method || !event.requestContext.http.method === 'GET') {
    return errorResponse()
  }

  if (!event.pathParameters || !event.pathParameters.id) {
    return errorResponse()
  }

  const placeId = event.pathParameters.id

  const params = {
    TableName: commentsTable,
    KeyConditionExpression: 'PK = :placeId',
    ExpressionAttributeValues: {
      ':placeId': placeId
    },
    ScanIndexForward: false
  }

  try {
    const commentsQuery = await doc.query(params).promise(params)
    return {
      statusCode: 200,
      body: JSON.stringify({ comments: commentsQuery.Items, region: process.env.AWS_REGION })
    }
  } catch (error) {
    return errorResponse(500, 'Unable to read from database')
  }
}

function errorResponse (code = 400, message = 'Invalid payload') {
  return {
    statusCode: code,
    body: JSON.stringify({ message })
  }
}
