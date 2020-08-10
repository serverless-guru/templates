const AWS = require("aws-sdk");
const jwtDecode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const RP = require("request-promise");
const iss = `https://cognito-idp.${process.env.COGNITO_USERPOOL_REGION}.amazonaws.com/${process.env.COGNITO_USERPOOL_ID}`;

// Generate policy to allow this user on this API:
const generatePolicy = (principalId, effect, resource, decoded) => {
  const authResponse = {};
  if (decoded) {
    authResponse.context = {
      // custom values you want to pass to the invoked lambda go here, they will show up in event.requestContext.authorizer.exampleKey
      exampleKey: 'exampleValue',
      // userId: decoded.userId
    };
  }
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  console.log(JSON.stringify(authResponse));
  return authResponse;
};

exports.handler = async event => {
  try {
    console.log(JSON.stringify(event));
    if (event.authorizationToken) {
      const token = event.authorizationToken;
      let verify = await verifyToken(token);
      let user = await jwtDecode(token);

      if (verify) {

        let customParams = {};

        // **** use cognitoUser object to get a value ****

        // let params = {
        //   UserPoolId: process.env.COGNITO_USERPOOL_ID,
        //   Username: user.username
        // };

        // let cognitoUser = await cognitoidentityserviceprovider
        //   .adminGetUser(params)
        //   .promise();

        // let userIdArray = cognitouser.UserAttributes.filter(
        //   (a) => a.Name == "custom:userId"
        // );

        // customParams.userId = userIdArray[0].Value;

        return generatePolicy(user.sub, "Allow", event.methodArn, customParams);
      } else return generatePolicy(user.sub, "Deny", event.methodArn, null);
    } else {
      console.log("No Authorization found in the header");
      return generatePolicy(user.sub, "Deny", event.methodArn, null);
    }
  } catch (error) {
    console.log('error', error);
    return generatePolicy(user.sub, "Deny", event.methodArn, null);
  }
};

let verifyToken = async token => {
  try {
    let response = await RP({
      method: "GET",
      uri: `${iss}/.well-known/jwks.json`,
      json: true,
      timeout: 25000,
    });
    const keys = response;
    const k = keys.keys[1];
    const jwkArray = {
      kty: k.kty,
      n: k.n,
      e: k.e,
    };
    const pem = jwkToPem(jwkArray);
    let tempToken = token.includes("Bearer") ? token.split(" ")[1] : token;
    let decoded = await jwt.verify(tempToken, pem);
    if (decoded.username) return true;
  } catch (err) {
    console.log('err', err);
    return null;
  }
};