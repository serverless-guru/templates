const lambda = require('./io')

const wait = async () => new Promise((res, rej) => {
  setTimeout(() => res(), 2000)
})

module.exports.one = async () => {
  await wait()
  await lambda('sls-antipatterns-lambdacalls-dev-two')
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'success'
    })
  }
}

module.exports.two = async () => {
  await wait()
  await lambda('sls-antipatterns-lambdacalls-dev-three')
  return { success: true }
}

module.exports.three = async () => {
  await wait()
  return { success: true }
}

