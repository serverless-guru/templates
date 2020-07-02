const fetch = require('node-fetch')
const retry = require('./utils/retry')
const http = require('./utils/http')

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
// Logic
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
class StatusError extends Error {
  constructor(msg, status) {
    super(msg);
    this.status = status;
  }
};

const getDataFromExternalService = async (rate) => {
  const res = await fetch(process.env.ENDPOINT + '/external', {
    method: "POST",
    body: JSON.stringify({
      errorRate: rate
    })
  });

  if (res.status > 299) {
    throw new StatusError('Error Mesage', res.status)
  }

  const result = await res.json()
  return {
    code: res.status,
    data: result
  }
}




// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
// HANDLERS
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
module.exports.start = async event => {
  const errorRate = JSON.parse(event.body).errorRate

  const result = await retry({
    fn: () => getDataFromExternalService(errorRate),
    isServerError: e => e.status !== 503 && e.status > 499,
    isTransientError: e => e.status === 503,
    isValidationError: e => e.status > 399 && e.status < 500
  })

  return {
    statusCode: 200,
    body: JSON.stringify(
      result
    ),
  }
}


module.exports.external = async event => {
  const errorRate = JSON.parse(event.body).errorRate
  const number = Math.round(Math.random() * 100)

  if (errorRate < number) {
    return http.transientError({
      data: 'it did not work'
    })
  }

  return http.success({
    data: 'it worked'
  })
}