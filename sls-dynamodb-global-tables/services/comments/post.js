'use strict'

const log = require('lambda-log')
const AWS = require('aws-sdk')
const doc = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true })
const { randomUUID } = require('crypto')

const commentsTable = process.env.COMMENTS_TABLE

module.exports.handler = async (event) => {
  log.info('Event', { event })

  if (!event || !event.requestContext || !event.requestContext.http || !event.requestContext.http.method || !event.requestContext.http.method === 'POST') {
    return errorResponse()
  }

  if (!event.pathParameters || !event.pathParameters.id) {
    return errorResponse()
  }

  const placeId = event.pathParameters.id
  const body = getBodyFromEvent(event)

  if (!body) {
    return errorResponse(400, 'No Body')
  }

  const requestId = event.requestContext.requestId
  const sourceIp = event.requestContext.http.sourceIp
  const userAgent = event.requestContext.http.userAgent
  const commentId = randomUUID()
  const createdAt = new Date().toISOString()
  const region = process.env.AWS_REGION

  let username = 'Anonymous'
  if (body.username) {
    username = body.username.trim()
  }

  const params = {
    TableName: commentsTable,
    Item: {
      PK: placeId,
      SK: `${createdAt}#${commentId}`,
      commentId,
      createdAt,
      username: username,
      rating: parseInt(body.rating),
      comment: body.comment,
      requestId,
      sourceIp,
      userAgent,
      region
    }
  }

  try {
    await doc.put(params).promise(params)
  } catch (error) {
    log.error(error)
    return errorResponse(500, 'Unable to write to database')
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      commentId,
      placeId,
      createdAt
    })
  }
}

function errorResponse (code = 400, message = 'Invalid payload', event = null) {
  return {
    statusCode: code,
    body: JSON.stringify({ message, event })
  }
}

function getBodyFromEvent (event) {
  try {
    if (event.isBase64Encoded === true) {
      return JSON.parse(Buffer.from(event.body, 'base64'))
    } else {
      return JSON.parse(event.body)
    }
  } catch (error) {
    log.error('Invalid Body')
    return undefined
  }
}
