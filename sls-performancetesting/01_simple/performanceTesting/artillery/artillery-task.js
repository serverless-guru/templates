/* eslint no-underscore-dangle: 0 */
const aws = require('aws-sdk') // eslint-disable-line import/no-extraneous-dependencies
const { run } = require('artillery')

const modes = require('./modes.js')

const artilleryAcceptance = require('./artillery-acceptance.js')
const artilleryMonitoring = require('./artillery-monitoring.js')
const artilleryPerformance = require('./artillery-performance.js')

const artilleryTask = {
  /**
   * Given an artillery script, return the appropriate artillery task type.
   *
   * @param script The artillery script to run, annotated with the expected mode.
   * @returns An artillery task fit for purpose.
   */
  createArtilleryTask: (script) => {
    modes.validateScriptMode(script)
    if (modes.isAcceptanceScript(script)) return artilleryAcceptance(artilleryTask)
    if (modes.isMonitoringScript(script)) return artilleryMonitoring(artilleryTask)
    return artilleryPerformance(artilleryTask)
  },

  /**
   * Invoke the deployed AWS Lambda function to provide the load specified.
   *
   * @param script The artillery script to run, annotated with the expected mode.
   * @param type Invocation type for the Lambda.
   * @returns Parsed `Payload` property from AWS Lambda.
   */
  invoke: (script, type) => {
    const lambda = new aws.Lambda({
      maxRetries: 0,
      region: process.env.AWS_REGION || 'us-east-1',
    })

    const params = {
      FunctionName: script._funcAws.functionName, // eslint-disable-line no-underscore-dangle
      InvocationType: type || 'Event',
      Payload: JSON.stringify(script),
    }

    if (process.env.SERVERLESS_STAGE) {
      params.FunctionName += `:${process.env.SERVERLESS_STAGE}`
    }

    // AWS Lambda (platform-specific) invocation
    return lambda.invoke(params).promise()
      .then((res) => {
        try {
          return JSON.parse(res.Payload)
        } catch (ex) {
          console.error(`Error parsing lambda execution payload:\n${res.Payload}\nCaused error:\n${ex.stack}`)
          return undefined // ignore error
        }
      })
      .catch((ex) => {
        console.error('Error invoking self:')
        console.error(ex.stack)
        return Promise.reject(new Error(`ERROR invoking self: ${ex.message}`))
      })
  },

  /**
   * Delay for the given number of milliseconds before resolving the returned promise.
   *
   * @param ms The number of milliseconds to delay before resolving the returned promise.
   * @returns {Promise<any>}
   */
  delay: (ms) => {
    if (ms > 0) return new Promise(resolve => setTimeout(resolve, ms))
    return Promise.resolve()
  },

  /**
   * Wait the requested time delay before simulating execution (simulation mode) or sending the given script to a new
   * copy of this function for execution (standard mode).
   *
   * @param timeDelay The amount of time to delay before sending the remaining jobs for execution
   * @param script The script containing the remaining jobs that is to be sent to the next Lambda
   * @param invocationType The lambda invocationType
   * @returns {Promise<any>}
   */
  invokeSelf(timeDelay, script, invocationType) {
    const trace = script._trace ? console.log : () => {}

    const exec = () => {
      trace(`invoking self for ${script._genesis} in ${script._start} @ ${Date.now()}`)
      return artilleryTask.invoke(script, invocationType)
        .then((result) => {
          trace(`invoke self complete for ${script._genesis} in ${script._start} @ ${Date.now()}`)
          return result
        })
    }

    trace(`scheduling self invocation for ${script._genesis} in ${script._start} with a ${timeDelay} ms delay`)

    return artilleryTask.delay(timeDelay).then(exec)
  },

  /**
   * Execute the given plans distributed across copies of this function
   *
   * @param timeNow The time ID of the current function
   * @param script The script that caused the execution of the current function
   * @param settings The settings to use for executing in the current function
   * @param plans The plans (each an event) to distribute over copies of this function
   * @returns {Promise<any>}
   */
  distribute: (timeNow, script, settings, plans) => {
    const trace = script._trace ? console.log : () => {
    }

    trace(`distributing ${plans.length} plans from ${script._genesis} in ${timeNow}`)

    const invocations = plans.map(plan => artilleryTask.invokeSelf(
      (plan._start - Date.now()) - settings.timeBufferInMilliseconds,
      plan,
      plan._invokeType // eslint-disable-line comma-dangle
    ).then((result) => {
      trace(`load test from ${script._genesis} executed by ${timeNow} partially complete @ ${Date.now()}`)
      return result
    }))
    return Promise.all(invocations)
      .then((reports) => {
        trace(`load test from ${script._genesis} in ${timeNow} completed @ ${Date.now()}`)
        return Promise.resolve({
          timeNow,
          script,
          settings,
          reports,
        })
      })
  },

  /**
   * Execute the given event in place, which is to say in the current function.
   *
   * @param timeNow The time ID of the current function
   * @param script The artillery script to execute in the current function
   * @returns {Promise<*>}
   */
  execute: (timeNow, script) => new Promise((resolve, reject) => {
    // Since Artillery will call process.exit() upon termination,
    // we monkey-patch it to load result and resolve/reject the Promise.
    const { exit } = process
    let testResults = null

    process.exit = (code) => {
      process.exit = exit // Unpatch
      console.log('Artillery done.')

      if (code !== 0) {
        reject(new Error(`Artillery exited with non-zero code: ${code}`))
      } else if (!testResults) {
        reject(new Error('Artillery exited with zero, but test results not set.'))
      } else {
        resolve(testResults)
      }
    }

    console.log('Starting Artillery...')
    run(script, { output: (result) => { testResults = result.aggregate } })
  }).catch((ex) => {
    const msg = `ERROR exception encountered while executing load from ${script._genesis} in ${timeNow}: ${ex.message}\n${ex.stack}`
    console.error(msg)
    throw new Error(msg)
  }),

  /**
   * Given a plan or set of plans, distribute or execute load as appropriate.
   *
   * @param script The script that caused the execution of the current function
   * @param settings The settings to use for executing in the current function
   * @param plans The plans (each an event) to distribute over copies of this function
   * @param timeNow The time ID of the current function
   * @returns Promise<*> Result of the execution or distribution.
   */
  executeAll: (script, settings, plans, timeNow) => {
    if (plans.length > 1) {
      return artilleryTask.distribute(timeNow, script, settings, plans)
    } else if (plans.length === 1) {
      return artilleryTask.execute(timeNow, plans[0])
    } else {
      const msg = `ERROR, no executable content in:\n${JSON.stringify(script)}!`
      console.error(msg)
      return Promise.reject(new Error(msg))
    }
  },

  /**
   * Entry point for the ArtilleryTask. Instantiates the appropriate concrete
   * artillery task to run and calls execute().
   *
   * @param timeNow The time ID of the current function
   * @param script The artillery script to execute in the current function
   * @returns {Promise<*>}
   */
  executeTask: (script, platformSettings) => {
    const theArtilleryTask = artilleryTask.createArtilleryTask(script)
    const timeNow = Date.now()
    return theArtilleryTask.execute(timeNow, script, platformSettings)
  },
}

module.exports = artilleryTask
