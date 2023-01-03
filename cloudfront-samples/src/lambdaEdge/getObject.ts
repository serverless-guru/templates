import type { CloudFrontRequestEvent, CloudFrontResponseResult } from 'aws-lambda'
import aws from 'aws-sdk'
import https from 'https'

const backendRegion = 'eu-central-1'

const documentClient = new aws.DynamoDB.DocumentClient({
  region: backendRegion,
  httpOptions: {
    agent: new https.Agent({
      keepAlive: true,
    }),
  },
})

export const handler = async (event: CloudFrontRequestEvent): Promise<CloudFrontResponseResult> => {
  const request = event.Records[0].cf.request

  try {
    const code = request.uri.split('/').slice(-1)[0]

    const data = await documentClient
      .get({
        TableName: 'demoContent',
        Key: {
          code,
        },
      })
      .promise()
    if (!(data && data.Item && data.Item.name)) {
      return notFound
    }
    return {
      status: '200',
      statusDescription: 'OK',
      body: JSON.stringify(data.Item),
      headers: {
        'content-type': [
          {
            value: 'application/json',
          },
        ],
        'cache-control': [
          {
            value: 'max-age=120',
          },
        ],
      },
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e as Error)

    return notFound
  }
}

const notFound = {
  status: '404',
  statusDescription: 'Not Found',
  headers: {
    'content-type': [
      {
        value: 'application/json',
      },
    ],
    'cache-control': [
      {
        value: 'max-age=10',
      },
    ],
  },
  body: JSON.stringify({ message: 'Object Not Found' }),
}
