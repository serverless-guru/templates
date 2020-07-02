const aws = require('aws-sdk')

/**
 * Get AWS clients
 * @param {object} credentials
 * @param {string} region
 * @returns {object} AWS clients
 */
const getClients = (credentials, region = 'us-east-1') => {
  const s3 = new aws.S3({ credentials, region })
  return {
    s3
  }
}

/**
 * Create S3 Bucket
 * @param {*} s3 
 * @param {*} config 
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property
 */
const createS3Bucket = (s3, config) => {
  return await s3.createBucket({
    Bucket: config.bucket,
    ACL: config.acl ? config.acl : 'private'
  }).promise();
}

/**
 * Remove S3 bucket
 * @param {*} s3 
 * @param {*} config 
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property
 */
const removeS3Bucket = (s3, config) => {
  return await s3.deleteBucket({
    Bucket: config.bucket
  }).promise();
}

module.exports = {
  getClients,
  createS3Bucket,
  removeS3Bucket
}
