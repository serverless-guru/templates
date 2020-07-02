exports.handler = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `API_KEY-${process.env.API_KEY}`
    })
  }
};