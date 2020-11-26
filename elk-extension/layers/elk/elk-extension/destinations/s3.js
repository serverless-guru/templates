const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.REGION
});

const s3 = new AWS.S3();

const S3_BUCKET_NAME = process.env.EXTENSION_LOG_DESTINATION_S3_BUCKET_NAME;
const S3_OBJECT_NAME = process.env.EXTENSION_LOG_DESTINATION_S3_OBJECT_NAME;

const sendLogs = (logs) => {
    const fileName = S3_OBJECT_NAME + '-' + new Date().toISOString() + '.log'

    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: logs
    };

    return s3.upload(params).promise();
}

module.exports = {
    sendLogs
};