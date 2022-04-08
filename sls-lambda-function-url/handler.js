'use strict';

const lambdaFunctionURLAPI = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Lambda Function URL API Call Response'
      },
      null,
      2
    ),
  };
};

const lambdaAPIGatewayAPI = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Lambda API Gateway API Call Response'
      },
      null,
      2
    ),
  };
};

module.exports = {
  lambdaFunctionURLAPI,
  lambdaAPIGatewayAPI
};