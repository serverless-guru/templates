const jwt = require('jsonwebtoken')
const jwkToPem = require('jwk-to-pem')
const request = require('request')

const iss = `https://cognito-idp.${process.env.COGNITO_USERPOOL_REGION}.amazonaws.com/${process.env.COGNITO_USERPOOL_ID}`

// Generate policy to allow this user on this API:
const generatePolicy = (principalId, effect, resource, decoded) => {

  // No arrays or JSON objects in context or you will get, AuthorizerConfigurationException,https://stackoverflow.com/a/51176078
  Object.keys(decoded).forEach((key) => {
    if(typeof decoded[key] !==  'string') {
      decoded[key] = JSON.stringify(decoded[key])
    }
  })
  const authResponse = {
    context: {
      ...decoded,
    }
  }
  authResponse.principalId = principalId
  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = '*'
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }
  return authResponse
}

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
module.exports.index = (event, context, cb) => {
  if (event.authorizationToken) {
    const token = event.authorizationToken

    // Make a request to the iss + .well-known/jwks.json URL:
    request(
      { url: `${iss}/.well-known/jwks.json`, json: true },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          console.log('Request error:', error)
          cb('Unauthorized')
        }
        const keys = body
        // Based on the JSON of `jwks` create a Pem:
        const k = keys.keys[0]
        const jwkArray = {
          kty: k.kty,
          n: k.n,
          e: k.e,
        }
        const pem = jwkToPem(jwkArray)

        // Verify the token:
        jwt.verify(token, pem, { issuer: iss }, (err, decoded) => {
          if (err) {
            console.log('Unauthorized user:', err.message)
            cb('Unauthorized')
          } else {
            cb(
              null,
              generatePolicy(decoded.sub, 'Allow', event.methodArn, decoded)
            )
          }
        })
      }
    )
  } else {
    console.log('No authorizationToken found in the header.')
    cb('Unauthorized')
  }
}
