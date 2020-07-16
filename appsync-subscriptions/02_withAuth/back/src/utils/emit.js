const AWS = require('aws-sdk')

const processStarted = async (data) => {
    const SNS = new AWS.SNS({
        region: process.env.AWS_REGION || 'us-east-2'
    })

    const x = await SNS.publish({
        Subject: `process-started-${process.env.STAGE}`,
        Message: JSON.stringify(data),
        TopicArn: `arn:aws:sns:${process.env.REGION}:${process.env.ACCOUNT_ID}:process-started-${process.env.STAGE}`
    }).promise()

    return x
}

module.exports = {
    processStarted
}