module.exports.handler = async (event) => {
  console.log('Event: ', event);
  let responseMessage = 'SG Terraform Lambda Deployed!';

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: responseMessage,
    }),
  }
}