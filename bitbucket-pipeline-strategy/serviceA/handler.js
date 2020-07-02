const moment = require('moment')
  
const db = require('./db')

module.exports.hello = async event => {
  await db.create({
    id: '123',
    name: 'name'
  })
  return {
    statusCode: 200,
    body: JSON.stringify({
        date: moment() + '_A__' + process.env.STAGE
    })
  }
}
