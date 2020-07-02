module.exports.endpoint = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: '1234',
      name: 'Dark Coffee'
    })
  }
}
