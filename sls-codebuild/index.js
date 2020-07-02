exports.handler = async event => {
  return {
    statusCode: event ? 200 : 500,
    body: JSON.stringify({'message': "hello world"})
  }
};