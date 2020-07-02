/**
 * Definition:
 * -----------------------
 * Makes Appsync call with a signed http request based on iam role credentials
 * 
 * Paramater Explanation:
 * -----------------------
 * The first execution of this function is to setup the credentials and the url
 * The url is required, credentials optional. 
 * If you do not include credentials, the AWS SDK will either take the default credentials 
 * in your .aws file, or a profile you specify in the command line using AWS_PROFILE=work
 * 
 * The second function execution requires a data object, which can have the following keys
 * - query
 * - mutation
 * 
 * The value of these keys is a string representing the graphql query
 * 
 */

const URL = require('url')
const AWS = require('aws-sdk')
const fetch = require('node-fetch')

module.exports = ({ credentials, url }) => (data, withoutCredentials = false) => {
    const uri = URL.parse(url)
    const httpRequest = new AWS.HttpRequest(uri.href, 'us-east-1');
    httpRequest.headers.host = uri.host;
    httpRequest.headers['Content-Type'] = 'application/json';
    httpRequest.method = 'POST';
    httpRequest.body = JSON.stringify(data);

    const config = {
        region: 'us-east-1',
        ...(credentials && ({
            credentials: new AWS.Credentials(credentials.key, credentials.secret)
        }))
    }
    AWS.config.update(config)

    if (!withoutCredentials) {
        const signer = new AWS.Signers.V4(httpRequest, "appsync", true);
        signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
    }

    const options = {
        method: httpRequest.method,
        body: httpRequest.body,
        headers: httpRequest.headers
    };

    return fetch(uri.href, options)
        .then(x => x.json())
}