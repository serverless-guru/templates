import type { CloudFrontFunctionsEvent} from 'aws-lambda';

/**
 * The Base64-encoded Auth string that should be present.
 * It is an encoding of `Basic base64([username]:[password])`
 * The username and password are:
 *      Username: foo
 *      Password: bar
 */
const basicAuthEncoded = 'Zm9vOmJhcg=='; // base64('foo:bar')

/**
 * Validates the request with the expected Basic Auth header
 */
export function handler(
  event: CloudFrontFunctionsEvent
): CloudFrontFunctionsEvent['request'] | CloudFrontFunctionsEvent['response'] {
  try {
    const request = event.request;
    const headers = request.headers;

    if (!('authorization' in headers) || !headers.authorization || !headers.authorization.value) {
      return unauthorizedRequest;
    }

    const expectedAuth = `Basic ${basicAuthEncoded}`;

    if (headers.authorization.value === expectedAuth) {
      return request;
    }
    return unauthorizedRequest;
  } catch {
    return unauthorizedRequest;
  }
}

const unauthorizedRequest: CloudFrontFunctionsEvent['response'] = {
  statusCode: 401,
  statusDescription: 'Unauthorized',
  headers: {
    'www-authenticate': {
      value: 'Basic realm="Enter credentials for this super secure site"',
    },
  },
  cookies: {},
};
