const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION

module.exports = (name, payload) => {
    const Lambda = new AWS.Lambda()
    const params = {
        FunctionName: name,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(payload),
        LogType: 'None'
    }
    return new Promise((resolve, reject) => {
        Lambda.invoke(params, (err, data) => {
            if (err) {
                return reject({
                    message: err
                })
            }

            const payload = JSON.parse(data.Payload)
            return resolve(payload)
        })
    })
}