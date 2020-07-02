
module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',

    })
  }
}


exports.image = async (event) => {
  const fs = require('fs')
  const image = fs.readFileSync('./assets/sky.png')
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "image/png"
    },
    body: image.toString('base64'),
    isBase64Encoded: true
  }
}