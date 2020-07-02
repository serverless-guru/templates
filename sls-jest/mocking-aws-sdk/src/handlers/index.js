const AWS = require('aws-sdk');
const s3 = new AWS.S3();

let index = {};

index.handler = async event => {
  let getObjectResult = await index.getObjectFromS3({});
  let deleteObjectResult = await index.deleteObjectFromS3({});

  console.log({
    getObjectResult,
    deleteObjectResult
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'hello'
    })
  }
};

index.deleteObjectFromS3 = async params => {
  return await s3.deleteObject(params).promise();
};

index.getObjectFromS3 = async params => {
  return await s3.getObject(params).promise();
};

module.exports = index;