const db = require('./db')

module.exports.add = async event => {
  const data = JSON.parse(event.body)
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
