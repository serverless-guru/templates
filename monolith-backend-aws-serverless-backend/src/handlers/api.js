const api = {};

api.handler = async event => {
  console.log('Event', event);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      message: `Response received`
    })
  }
};

module.exports = api;