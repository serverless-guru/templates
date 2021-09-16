'use strict'

module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      region: process.env.AWS_REGION
    })
  }
}
