const AWS = require('aws-sdk')

const postRequested = async ({ userId, pollId }) => {
    const SNS = new AWS.SNS({
        region: process.env.AWS_REGION || 'us-east-2'
    })

    const x = await SNS.publish({
        Subject: `post-requested-${process.env.STAGE}`,
        Message: JSON.stringify({
            userId,
            pollId
        }),
        TopicArn: `arn:aws:sns:${process.env.REGION}:${process.env.ACCOUNT_ID}:post-requested-${process.env.STAGE}`
    }).promise()

    return x
}

module.exports = {
    postRequested
}
