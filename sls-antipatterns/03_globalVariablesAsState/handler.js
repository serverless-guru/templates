var counter = 0

module.exports.hello = async event => {
  counter++
  return {
    statusCode: 200,
    body: JSON.stringify({ input: counter })
  }
}
