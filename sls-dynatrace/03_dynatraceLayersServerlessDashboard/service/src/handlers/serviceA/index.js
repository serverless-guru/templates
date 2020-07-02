/**
 * When using both the Serverless Dashboard and Dynatrace,
 * we are working with 2 products that are wrapping our handler,
 * resulting in the handler function being wrapped twice.
 * 
 * When wrapped first by Dynatrace and then Serverless Dashboard,
 * we must use callback style functions. If we return a promise with
 * an async function, Dynatrace will resolve this handler function 
 * as a promise and pass a promise rather than a function to the 
 * Serverless Dashboard code that wraps the Dynatrace handler.
 * 
 * If we want to use async functions for our business logic, we can
 * follow AWS's best practices and seperate business logic from 
 * Lambda specific code:
 * 
 * https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html#function-code
 * 
 */

const main = async () => {
  return {
      message: 'Success'
  }
}

module.exports.handler = (event, context, cb) => {
  main()
    .then(x => cb(null, {
        statusCode: 200,
        body: JSON.stringify(x)
    }))
    .catch(e => {
      cb(null, {
        statusCode: 500,
        body: JSON.stringify(
          {
            message: e
          }
        )
      })
    })
}

