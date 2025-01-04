import type { APIGatewayProxyEventV2 } from 'aws-lambda'

export const handler = async (event: APIGatewayProxyEventV2): Promise<string> => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(event, null, 2))
  return event.headers['cloudfront-viewer-country'] || 'unknown'
}
