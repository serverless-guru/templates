const db = require('./db')

module.exports.create = async event => {
  const data = JSON.parse(event.body)
  if (!data.id || !data.name) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: 'invalid'
        }
      )
    }
  }

  const result = await db.create(data)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data: result
      }
    )
  }
}

module.exports.get = async event => {
  if (!event.queryStringParameters || !event.queryStringParameters.id) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: 'invalid'
        }
      )
    }
  }
  const id = event.queryStringParameters.id

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: 'invalid'
        }
      )
    }
  }

  const result = await db.get(id)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data: result
      }
    )
  }
}
