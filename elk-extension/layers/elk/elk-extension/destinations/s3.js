const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.REGION
});

const s3 = new AWS.S3();

const S3_BUCKET_NAME = process.env.LOGS_DESTINATION_BUCKET_NAME;
const S3_OBJECT_NAME = process.env.LOGS_DESTINATION_OBJECT_NAME;

const uploadLogsToS3 = (data) => {
    const fileName = S3_OBJECT_NAME + '-' + new Date().toISOString() + '.log'

    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: data
    };

    return s3.upload(params).promise();
}

module.exports = {
  uploadLogsToS3
};