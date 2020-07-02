module.exports.handler = async event => {
  console.log(event, null, 2);
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'good'
      })
    };
};