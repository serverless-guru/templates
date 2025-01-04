import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(event, null, 2))
  return {
    headers: {
      'content-type': 'application/json',
      'x-service': 'apigw',
      'cache-control': 'max-age=10',
    },
    statusCode: 200,
    isBase64Encoded: false,
    body: JSON.stringify(event),
  }
}
