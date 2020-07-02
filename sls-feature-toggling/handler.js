const AWS = require('aws-sdk')
const ssm = new AWS.SSM()

// GET PARAMETERS
let getParams = async () => {
  let req = {
    Names: ['db'],
    WithDecryption: true
  }
  let resp = await ssm.getParameters(req).promise()

  let params = {}
  for (let p of resp.Parameters) {
    params[p.Name] = p.Value
  }

  return params
}


// DB
const newDatabaseCode = () => {
  console.log('NEW CODE')
  return 'dynamo'
}

const currentDatabaseCode = () => {
  console.log('OLD CODE')
  return 'sql'
}

const db = {
  get: async () => {
    const featureToggles = await getParams()

    if (featureToggles.db === 'dynamo') {
      return newDatabaseCode()
    } else {
      return currentDatabaseCode()
    }
  }
}


module.exports.hello = async event => {
  const data = await db.get()
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        using: data
      }
    )
  }
}
