import type { CloudFrontResponseEvent, CloudFrontResponseResult } from 'aws-lambda'

export const handler = async (
  event: CloudFrontResponseEvent,
): Promise<CloudFrontResponseResult> => {
  const response = event.Records[0].cf.response
  const request = event.Records[0].cf.request

  try {
    const status = parseInt(response.status)
    if (status >= 400 && status <= 599) {
      return redirect(request.uri)
    } else {
      return response
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e as Error)

    return redirect(request.uri)
  }
}

const redirect = (uri: string): CloudFrontResponseResult => {
  return {
    status: '307',
    statusDescription: 'Temporary Redirect',
    headers: {
      location: [
        {
          value: `https://alt.example.com${uri}`,
        },
      ],
    },
  }
}
