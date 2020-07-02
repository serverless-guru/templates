const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.REGION || 'us-east-1' })
const s3 = new AWS.S3();

const uploadBucket = process.env.BUCKET

exports.handler = async (event) => {
  const result = await getUploadURL(event)
  return result
};

const getUploadURL = async function (event) {
  const type = JSON.parse(event.body).type
  const ext = type.split('/')[1]

  const actionId = uuidv4()
  const s3Params = {
    Bucket: uploadBucket,
    Key: `${actionId}.${ext}`,
    ContentType: type,
    CacheControl: 'max-age=31104000',
    ACL: 'public-read',
  };

  return new Promise((resolve, reject) => {
    // Get signed URL
    const uploadURL = s3.getSignedUrl('putObject', s3Params)
    resolve({
      "statusCode": 200,
      "isBase64Encoded": false,
      "headers": {
        "Access-Control-Allow-Origin": "*"
      },
      "body": JSON.stringify({
        "uploadURL": uploadURL,
        "photoFilename": `${actionId}.${ext}`
      })
    })
  })
}