const moment = require('moment')
module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify({
        date: moment() + '_B_' + process.env.STAGE
    })
  }
}
