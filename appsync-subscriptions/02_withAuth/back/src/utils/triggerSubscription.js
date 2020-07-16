const env = require('process').env
const AWS = require('aws-sdk')
const URL = require('url')
const fetch = require('node-fetch')

AWS.config.update({
    region: process.env.REGION,
    credentials: new AWS.Credentials(env.AWS_ACCESS_KEY_ID, env.AWS_SECRET_ACCESS_KEY, env.AWS_SESSION_TOKEN)
})

const signRequest = (data) => {
    const uri = URL.parse(process.env.ENDPOINT)
    const httpRequest = new AWS.HttpRequest(uri.href, process.env.REGION)
    httpRequest.headers.host = uri.host
    httpRequest.headers['Content-Type'] = 'application/json'
    httpRequest.method = 'POST'
    httpRequest.body = JSON.stringify(data)

    const signer = new AWS.Signers.V4(httpRequest, "appsync", true)
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate())

    const options = {
        method: httpRequest.method,
        body: httpRequest.body,
        headers: httpRequest.headers
    };

    return fetch(uri.href, options)
        .then(x => x.json())
}

module.exports = {
    triggerOnComplete: async data => {
        return await signRequest({
            query: `mutation {
                    updateToComplete (input: {	
                        PK: "${data.PK}",
                        SK: "${data.SK}",
                        status: "COMPLETE"
                    }) {
                        PK,
                        SK,
                        status
                    }
                }`
        })
    }
} 