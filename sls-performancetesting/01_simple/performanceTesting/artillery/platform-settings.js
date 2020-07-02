/* eslint-disable no-underscore-dangle */
const platformSettings = {
  /**
   * The hard coded maximum duration for an entire load test (as a set of jobs) in seconds.
   * (_split.maxScriptDurationInSeconds must be set in your script if you want to use values up to this duration)
   */
  MAX_SCRIPT_DURATION_IN_SECONDS: 6 * 24 * 60 * 60, // 6 days
  /**
   * The default maximum duration for an entire load test (as a set of jobs) in seconds
   */
  DEFAULT_MAX_SCRIPT_DURATION_IN_SECONDS: 24 * 60 * 60, // 1 day
  /**
   * The default maximum number of concurrent lambdas to invoke with the given script.
   * (_split.maxScriptRequestsPerSecond must be set in your script if you want to use values up to this rate)
   */
  MAX_SCRIPT_REQUESTS_PER_SECOND: 50 * 1000,
  /**
   * The default maximum number of concurrent lambdas to invoke with the given script
   */
  DEFAULT_MAX_SCRIPT_REQUESTS_PER_SECOND: 5000,
  /**
   * The hard coded maximum duration for a single lambda to execute in seconds this should probably never change until
   * Lambda maximums are increased.
   * (_split.maxChunkDurationInSeconds must be set in your script if you want to use values up to this duration)
   */
  MAX_CHUNK_DURATION_IN_SECONDS: (14 * 60) + 45, // 4 minutes and 45 seconds (allow for 15 second alignment time)
  /**
   * The hard coded minimum duration for a single lambda to execute in seconds.
   */
  MIN_CHUNK_DURATION_IN_SECONDS: 15, // 15 seconds
  /**
   * The default maximum duration for a scenario in seconds (this is how much time a script is allowed to take before
   * it will be split across multiple function executions)
   */
  DEFAULT_MAX_CHUNK_DURATION_IN_SECONDS: 2 * 60, // 2 minutes
  /**
   * The hard coded maximum number of requests per second that a single lambda should attempt.  This is more than a
   * fully powered Lambda can properly perform without impacting the measurements.
   * (_split.maxChunkRequestsPerSecond must be set in your script if you want to use values up to this rate)
   */
  MAX_CHUNK_REQUESTS_PER_SECOND: 500,
  /**
   * The default maximum number of requests per second that a single lambda should attempt
   */
  DEFAULT_MAX_CHUNK_REQUESTS_PER_SECOND: 25,
  /**
   * The hard coded maximum number of seconds to wait for your functions to start producing load.
   * (_split.timeBufferInMilliseconds must be set in your script if you want to use values up to this duration)
   */
  MAX_TIME_BUFFER_IN_MILLISECONDS: 30 * 1000,
  /**
   * The default amount of buffer time to provide between starting a "next job" (to avoid cold starts and the
   * like) in milliseconds
   */
  DEFAULT_MAX_TIME_BUFFER_IN_MILLISECONDS: 15 * 1000,
  /**
   * The default amount of buffer time to provide prior to function infrastructure timeout during which to allow
   * the function to report an invocation success that nonetheless comprises a task failure via timeout
   */
  MAX_TIMEOUT_BUFFER_IN_MILLISECONDS: 15 * 1000,
  /**
   * The field in the input that identifies the script file to be used for monitoring mode.
   */
  MERGE_FIELD: '>>',

  /**
   * Validate the given event's function relevant configuration, throwing an exception if invalid configuration is discovered.
   * @param script The event given to validate
   * @param settings Platform-specific settings to run SA.
   */
  validate: (script, settings) => {
    // Splitting Settings [Optional]
    if (script && script._split && typeof script._split !== 'object') { // eslint-disable-line no-underscore-dangle
      throw new Error('If specified, the "_split" attribute must contain an object')
    }

    const checkBoundedIntegerSetting = (setting, minimum, maximum) => {
      const value = settings[setting]

      if (value) {
        const isInvalidValue = !Number.isInteger(value) || value < minimum || value > maximum

        if (isInvalidValue) {
          throw new Error(`If specified, the "_split.${setting}" attribute must be an integer ` +
            `inclusively between ${minimum} and ${maximum}.`)
        }
      }
    }

    checkBoundedIntegerSetting('maxChunkDurationInSeconds', platformSettings.MIN_CHUNK_DURATION_IN_SECONDS, platformSettings.MAX_CHUNK_DURATION_IN_SECONDS)
    checkBoundedIntegerSetting('maxScriptDurationInSeconds', 1, platformSettings.MAX_SCRIPT_DURATION_IN_SECONDS)
    checkBoundedIntegerSetting('maxChunkRequestsPerSecond', 1, platformSettings.MAX_CHUNK_REQUESTS_PER_SECOND)
    checkBoundedIntegerSetting('maxScriptRequestsPerSecond', 1, platformSettings.MAX_SCRIPT_REQUESTS_PER_SECOND)
    checkBoundedIntegerSetting('timeBufferInMilliseconds', 1, platformSettings.MAX_TIME_BUFFER_IN_MILLISECONDS)
  },

  /**
   * Obtain settings, replacing any of the defaults with user supplied values.
   * @param script The script that split settings were supplied to.
   * @returns
   * {
   *   {
   *     maxScriptDurationInSeconds: number,
   *     maxScriptRequestsPerSecond: number,
   *     maxChunkDurationInSeconds: number,
   *     maxChunkRequestsPerSecond: number,
   *     timeBufferInMilliseconds: number,
   *   }
   * }
   * The settings for the given script which consists of defaults overwritten by any user supplied values.
   */
  getSettings: (script) => {
    const split = script && script._split ? script._split : {}
    const settings = Object.assign({
      maxScriptDurationInSeconds: platformSettings.DEFAULT_MAX_SCRIPT_DURATION_IN_SECONDS,
      maxScriptRequestsPerSecond: platformSettings.DEFAULT_MAX_SCRIPT_REQUESTS_PER_SECOND,
      maxChunkDurationInSeconds: platformSettings.DEFAULT_MAX_CHUNK_DURATION_IN_SECONDS,
      maxChunkRequestsPerSecond: platformSettings.DEFAULT_MAX_CHUNK_REQUESTS_PER_SECOND,
      timeBufferInMilliseconds: platformSettings.DEFAULT_MAX_TIME_BUFFER_IN_MILLISECONDS,
    }, split)

    platformSettings.validate(script, settings)

    return settings
  },
}

module.exports = platformSettings
