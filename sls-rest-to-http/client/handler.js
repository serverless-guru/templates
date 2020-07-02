const fetch = require('node-fetch')

const old = async () => {
  const rest = 'https://ks0f5y3ool.execute-api.us-east-1.amazonaws.com/dev/rest/get'
  const res = await fetch(rest)
  return await res.json()
}

const newFeature = async () => {
  const http = 'https://ihz2aks4ta.execute-api.us-east-1.amazonaws.com/http/get'
  const res = await fetch(http)
  return await res.json()
}


const v2 = false
module.exports.main = async event => {

  let result
  if (v2) {
    result = await newFeature()
  } else {
    result = await old()
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data: result
      }
    )
  }
}
