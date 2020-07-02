
const thirtyFiveSeconds = 35000

const wait = () => new Promise((res) => {
  setTimeout(() => {
    res()
  }, thirtyFiveSeconds)
})

module.exports.payment = async event => {

  await wait()

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      {
        message: 'Success!'
      }
    )
  }
}
