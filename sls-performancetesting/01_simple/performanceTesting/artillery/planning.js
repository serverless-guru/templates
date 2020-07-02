/* eslint-disable no-underscore-dangle */
const modes = require('./modes.js')

const planning = {
  // ###############
  // ## DURATIONS ##
  // ###############
  /**
   * Obtain the duration of a phase in seconds.
   * @param phase The phase to obtain duration from.
   * @returns {number} The duration of the given phase in seconds.  If a duration cannot be obtained -1 is returned.
   */
  phaseDurationInSeconds: (phase) => {
    if ('duration' in phase) {
      return phase.duration
    } else if ('pause' in phase) {
      return phase.pause
    } else {
      return -1
    }
  },
  /**
   * Calculate the total duration of the Artillery script in seconds.  If a phase does not have a valid duration,
   * the index of that phase, multiplied by -1, will be returned.  This way a result less than zero result can
   * easily be differentiated from a valid duration and the offending phase can be identified.
   * @param script The script to identify a total duration for.
   * @returns {number} The total duration in seconds for the given script.  If any phases do not contain a valid duration,
   * the index of the first phase without a valid duration will be returned, multiplied by -1.
   */
  scriptDurationInSeconds: (script) => {
    let ret = 0
    let i
    let phaseDurationInSeconds
    for (i = 0; i < script.config.phases.length; i++) {
      phaseDurationInSeconds = planning.phaseDurationInSeconds(script.config.phases[i])
      if (phaseDurationInSeconds < 0) {
        ret = -1 * i
        break
      } else {
        ret += phaseDurationInSeconds
      }
    }
    return ret
  },
  /**
   * Split the given phase along the time dimension so that the resulting chunk is no longer than the given chunkSize
   * @param phase The phase to split so that the produced chunk is no more than chunkSize seconds long
   * @param chunkSize The duration, in seconds, that the chunk removed from the phase should be no longer than
   * @returns {{chunk, remainder: *}} The chunk that is chunkSize duration and the remainder of the phase.
   */
  splitPhaseByDurationInSeconds: (phase, chunkSize) => {
    const ret = {
      chunk: JSON.parse(JSON.stringify(phase)),
      remainder: phase,
    }
    let diff
    let ratio
    if ('duration' in phase) {
      // split the ramp - the rampTo for the chunk and the arrival rate for the remainder are changed.
      if ('rampTo' in phase && 'arrivalRate' in phase) {
        // if arrivalRate < rampTo (ramping down) this will be negative, that's okay
        diff = phase.rampTo - phase.arrivalRate
        ratio = chunkSize / phase.duration
        // TODO should we round?  Potentially, this could lead to non-smooth ramps
        ret.chunk.rampTo = Math.round(ret.chunk.arrivalRate + (diff * ratio))
        ret.remainder.arrivalRate = ret.chunk.rampTo
      } else if ('arrivalCount' in phase) { // split the arrival count proportionally
        ratio = chunkSize / phase.duration
        // TODO should we round?  Potentially, this could lead to non-constant arrivals
        ret.chunk.arrivalCount = Math.round(ret.chunk.arrivalCount * ratio)
        ret.remainder.arrivalCount -= ret.chunk.arrivalCount
      }
      // nothing to do in the 'arrivalRate' ONLY case, since arrivalRate doesn't change based on time reduction
      ret.chunk.duration = chunkSize
      ret.remainder.duration -= chunkSize
    } else if ('pause' in phase) {
      ret.chunk.pause = chunkSize
      ret.remainder.pause -= chunkSize
    }
    return ret
  },
  /**
   * Split the given script along the time dimension so that the resulting chunk is no longer than the given chunkSize
   * @param script The script to split so that the produced chunk is no more than chunkSize seconds long
   * @param chunkSize The duration, in seconds, that the chunk removed from the script should be no longer than
   * @returns {{chunk, remainder: *}} The chunk that is chunkSize duration and the remainder of the script.
   */
  splitScriptByDurationInSeconds: (script, chunkSize) => {
    const ret = {
      chunk: JSON.parse(JSON.stringify(script)),
      remainder: script,
    }
    let remainingDurationInSeconds = chunkSize
    let phase
    let phaseDurationInSeconds
    let phaseParts
    ret.chunk.config.phases = []
    if (ret.remainder._start) {
      delete ret.remainder._start
    }
    while (remainingDurationInSeconds > 0 && ret.remainder.config.phases.length) {
      phase = ret.remainder.config.phases.shift()
      phaseDurationInSeconds = planning.phaseDurationInSeconds(phase)
      if (phaseDurationInSeconds > remainingDurationInSeconds) { // split phase
        phaseParts = planning.splitPhaseByDurationInSeconds(phase, remainingDurationInSeconds)
        ret.chunk.config.phases.push(phaseParts.chunk)
        ret.remainder.config.phases.unshift(phaseParts.remainder)
        remainingDurationInSeconds = 0
      } else {
        ret.chunk.config.phases.push(phase)
        remainingDurationInSeconds -= phaseDurationInSeconds
      }
    }
    return ret
  },
  // ##############
  // ## REQUESTS ##
  // ##############
  /**
   * Obtain the specified requests per second of a phase.
   * @param phase The phase to obtain specified requests per second from.
   * @returns The specified requests per second of a phase.  If a valid specification is not available, -1 is returned.
   */
  phaseRequestsPerSecond: (phase) => {
    if ('rampTo' in phase && 'arrivalRate' in phase) {
      return Math.max(phase.arrivalRate, phase.rampTo)
    } else if ('arrivalRate' in phase) {
      return phase.arrivalRate
    } else if ('arrivalCount' in phase && 'duration' in phase) {
      return phase.arrivalCount / phase.duration
    } else if ('pause' in phase) {
      return 0
    } else {
      return -1
    }
  },
  /**
   * Calculate the maximum requests per second specified by a script.  If a phase does not have a valid requests per second,
   * the index of that phase, multiplied by -1, will be returned.  This way a result less than zero result can easily be
   * differentiated from a valid requests per second and the offending phase can be identified.
   *
   * @param script The script to identify a maximum requests per second for.
   * @returns {number} The requests per second specified by the script or -i if an invalid phase is encountered,
   * where i is the zero based index of the phase containing an invalid requests per second value.
   */
  scriptRequestsPerSecond: (script) => {
    /*
     * See https://artillery.io/docs/script_reference.html#phases for phase types.
     *
     * The following was obtained 07/26/2016:
     * arrivalRate - specify the arrival rate of virtual users for a duration of time. - A linear “ramp” in arrival
     *      can be also be created with the rampTo option.                          // max(arrivalRate, rampTo) RPS
     * arrivalCount - specify the number of users to create over a period of time.  // arrivalCount/duration RPS
     * pause - pause and do nothing for a duration of time.                         // zero RPS
     */
    let ret = 0
    let i
    let phaseRps
    for (i = 0; i < script.config.phases.length; i++) {
      phaseRps = planning.phaseRequestsPerSecond(script.config.phases[i])
      if (phaseRps < 0) {
        ret = -1 * i
        break
      } else {
        ret = Math.max(ret, phaseRps)
      }
    }
    return ret
  },
  // Given that we have a flat line, abc and intersection should be reducible to fewer instructions.
  // sigh... time constraints.
  /**
   * Determine the Ax +By = C specification of the strait line that intersects the two given points
   * See https://www.topcoder.com/community/data-science/data-science-tutorials/geometry-concepts-line-intersection-and-its-applications/
   * @param p1 The first point of the line segment to identify.  E.g. { x: 0, y: 0 }
   * @param p2 The second point of the line segment to identify.  E.g. { x: 2, y: 2 }
   * @returns
   * {
   *   {
   *     A: number,
   *     B: number,
   *     C: number
   *   }
   * }
   * The line specification (Ax +By = C) running through the two given points.  E.g. { A: 2, B: -2, C: 0 }
   */
  abc: (p1, p2) => {
    const ret = {
      A: p2.y - p1.y,
      B: p1.x - p2.x,
    }
    ret.C = (ret.A * p1.x) + (ret.B * p1.y)
    return ret
  },
  /**
   * Determine the intersection point of two lines specified by an A, B, C trio
   * See https://www.topcoder.com/community/data-science/data-science-tutorials/geometry-concepts-line-intersection-and-its-applications/
   * @param l1 The first line to determine the intersection point for.  E.g. { A: 2, B: -2, C: 0 }
   * @param l2 The second line to determine the intersection point for.  E.g. { A: 0, B: -2, C: -2 }
   * @returns {{x: number, y: number}} The point of intersection between the two given lines.  E.g. {x: 1, y: 1}
   */
  intersect: (l1, l2) => {
    const ret = {}
    const det = (l1.A * l2.B) - (l2.A * l1.B)
    if (det === 0) {
      throw new Error('Parallel lines never intersect, detect and avoid this case')
    } else {
      ret.x = Math.round(((l2.B * l1.C) - (l1.B * l2.C)) / det)
      ret.y = Math.round(((l1.A * l2.C) - (l2.A * l1.C)) / det)
    }
    return ret
  },
  /**
   * Determine the intersection of the phase's ramp specification with the chunkSize limit
   * @param phase The phase to intersect with the given chunkSize limit
   * @param chunkSize The limit to RPS for the given phase
   * @returns {{x: number, y: number}} The intersection point of the phase's ramp with the chunkSize limit
   */
  intersection: (phase, chunkSize) => {
    const ramp = planning.abc({ x: 0, y: phase.arrivalRate }, { x: phase.duration, y: phase.rampTo })
    const limit = planning.abc({ x: 0, y: chunkSize }, { x: phase.duration, y: chunkSize })
    return planning.intersect(ramp, limit)
  },
  /**
   * Overwrite the given field with the given value in the given phase.  If the value is null, then if the attribute
   * is defined in the given phase, delete the attribute from the phase.
   * @param phase The phase to alter
   * @param field The field in the phase to set or delete
   * @param value The value to set the field of the phase to have or, if null, to delete
   */
  overWrite: (phase, field, value) => {
    if (value !== null) {
      phase[field] = value // eslint-disable-line no-param-reassign
    } else if (field in phase) {
      delete phase[field] // eslint-disable-line no-param-reassign
    }
  },
  /**
   * Copy the given phase, overwriting it's values with the given values, and then push the result to the given array
   * @param arr The array to put the resulting phase copy into
   * @param phase The phase to copy
   * @param arrivalCount The arrivalCount value to set (see artillery.io)
   * @param arrivalRate The arrivalRate value to set (see artillery.io)
   * @param rampTo The rampTo value to set (see artillery.io)
   * @param duration The duration value to set (see artillery.io)
   * @param pause The pause value to set (see artillery.io)
   */
  copyOverwritePush: (arr, phase, arrivalCount, arrivalRate, rampTo, duration, pause) => {
    const newPhase = JSON.parse(JSON.stringify(phase))
    planning.overWrite(newPhase, 'arrivalCount', arrivalCount)
    planning.overWrite(newPhase, 'arrivalRate', arrivalRate)
    planning.overWrite(newPhase, 'rampTo', rampTo)
    planning.overWrite(newPhase, 'duration', duration)
    planning.overWrite(newPhase, 'pause', pause)
    arr.push(newPhase)
  },
  /**
   * Add an arrivalCount phase that is an altered copy of the given phase to the given phase array
   * @param arr The array to add the specified phase to
   * @param phase The phase to copy and alter
   * @param arrivalCount The arrivalCount of the new phase (see artillery.io)
   * @param duration The duration of the new phase (see artillery.io)
   */
  addArrivalCount: (arr, phase, arrivalCount, duration) => {
    planning.copyOverwritePush(arr, phase, arrivalCount, null, null, duration, null)
  },
  /**
   * Add an arrivalRate phase that is an altered copy of the given phase to the given phase array
   * @param arr The array to add the specified phase to
   * @param phase The phase to copy and alter
   * @param arrivalRate The arrivalRate of the new phase (see artillery.io)
   * @param duration The duration of the new phase (see artillery.io)
   */
  addArrivalRate: (arr, phase, arrivalRate, duration) => {
    planning.copyOverwritePush(arr, phase, null, arrivalRate, null, duration, null)
  },
  /**
   * Add an arrivalRate phase that is an altered copy of the given phase to the given phase array
   * @param arr The array to add the specified phase to
   * @param phase The phase to copy and alter
   * @param arrivalRate The arrivalRate of the new phase (see artillery.io)
   * @param rampTo The rampTo of the new phase (see artillery.io)
   * @param duration The duration of the new phase (see artillery.io)
   */
  addRamp: (arr, phase, arrivalRate, rampTo, duration) => {
    planning.copyOverwritePush(arr, phase, null, arrivalRate > 0 ? arrivalRate : 1, rampTo, duration, null)
  },
  /**
   * Add an arrivalRate phase that is an altered copy of the given phase to the given phase array
   * @param arr The array to add the specified phase to
   * @param phase The phase to copy and alter
   * @param pause The pause of the new phase (see artillery.io)
   */
  addPause: (arr, phase, pause) => {
    planning.copyOverwritePush(arr, phase, null, null, null, null, pause)
  },
  /**
   * Split the requests per second of a phase to be no more than the given chunkSize.
   * @param phase The phase to split
   * @param chunkSize The maximum number of requests per second to allow in the chunked off phase
   * @returns {*} {{chunk, remainder: *}} The chunk that is at most chunkSize requests per second and the
   * remainder of the pahse.
   */
  splitPhaseByRequestsPerSecond: (phase, chunkSize) => {
    const ret = {
      chunk: [],
      remainder: [],
    }
    let max
    let min
    let intersection
    let rps
    let arrivalCount
    if ('rampTo' in phase && 'arrivalRate' in phase && phase.rampTo === phase.arrivalRate) {
      // no actual ramp... :P  Still, be nice and tolerate this for users
      delete phase.rampTo // eslint-disable-line no-param-reassign
    }
    if ('rampTo' in phase && 'arrivalRate' in phase) { // ramp phase
      max = Math.max(phase.arrivalRate, phase.rampTo)
      min = Math.min(phase.arrivalRate, phase.rampTo)
      if (max <= chunkSize) {
        // the highest portion of the ramp does not exceed the chunkSize, consume the phase and create a pause remainder
        planning.addRamp(ret.chunk, phase, phase.arrivalRate, phase.rampTo, phase.duration)
        planning.addPause(ret.remainder, phase, phase.duration)
      } else if (min >= chunkSize) {
        // the least portion of the ramp exceeds chunkSize, produce a constant arrival and reduce the ramp by chunkSize
        planning.addArrivalRate(ret.chunk, phase, chunkSize, phase.duration)
        planning.addRamp(ret.remainder, phase, phase.arrivalRate - chunkSize, phase.rampTo - chunkSize, phase.duration)
      } else {
        // otherwise, the chunkSize intersects the phase's request per second trajectory, differentially split across
        // the intersection
        // Case 1                 Case 2                  Where
        // y2  |      |    *      y1  | *    |            cs = chunkSize
        //     |   p     r            |  r      p         d  = duration
        // cs  |- - - *- - -      cs  |- - - *- - -       x  = intersection
        //     |   r  |  a            |  a   |  r         y1 = arrivalRate
        // y1  | *                y2  |           *       y2 = rampTo
        //     |      |               |      |            r  = a ramp phase
        //  0 _|____________       0 _|____________       a  = an constant arrival phase
        //     |                      |                   p  = a pause phase
        //     0      x    d         0      x    d        *  = a starting, ending, or intermediate RPS
        intersection = planning.intersection(phase, chunkSize)
        if (phase.arrivalRate < phase.rampTo) {
          planning.addRamp(ret.chunk, phase, phase.arrivalRate, chunkSize, intersection.x)
          planning.addArrivalRate(ret.chunk, phase, chunkSize, phase.duration - intersection.x)
          planning.addPause(ret.remainder, phase, intersection.x)
          planning.addRamp(ret.remainder, phase, 1, phase.rampTo - chunkSize, phase.duration - intersection.x)
        } else {
          planning.addArrivalRate(ret.chunk, phase, chunkSize, intersection.x)
          planning.addRamp(ret.chunk, phase, chunkSize, phase.rampTo, phase.duration - intersection.x)
          planning.addRamp(ret.remainder, phase, phase.arrivalRate - chunkSize, 1, intersection.x)
          planning.addPause(ret.remainder, phase, phase.duration - intersection.x)
        }
      }
    } else if ('arrivalRate' in phase) { // constant rate phase
      if (phase.arrivalRate > chunkSize) { // subtract the chunkSize if greater than that
        planning.addArrivalRate(ret.chunk, phase, chunkSize, phase.duration)
        planning.addArrivalRate(ret.remainder, phase, phase.arrivalRate - chunkSize, phase.duration)
      } else { // Otherwise, include the entire arrival and create a pause for the remainder
        planning.addArrivalRate(ret.chunk, phase, phase.arrivalRate, phase.duration)
        planning.addPause(ret.remainder, phase, phase.duration)
      }
    } else if ('arrivalCount' in phase && 'duration' in phase) {
      // constant rate stated as total scenarios delivered over a duration
      rps = phase.arrivalCount / phase.duration
      if (rps >= chunkSize) {
        arrivalCount = Math.floor(chunkSize * phase.duration)
        planning.addArrivalCount(ret.chunk, phase, arrivalCount, phase.duration)
        planning.addArrivalCount(ret.remainder, phase, phase.arrivalCount - arrivalCount, phase.duration)
      } else {
        planning.addArrivalCount(ret.chunk, phase, phase.arrivalCount, phase.duration)
        planning.addPause(ret.remainder, phase, phase.duration)
      }
    } else if ('pause' in phase) {
      planning.addPause(ret.chunk, phase, phase.pause)
      planning.addPause(ret.remainder, phase, phase.pause)
    }
    return ret
  },
  /**
   * Split the given script in to a chunk of the given maximum size in requests per second and a remainder.  This is
   * usually done because the script specifies too much load to produce from a single function.  Do this by chunking
   * off the maximum RPS a single function can handle.
   * @param script The script to split off a chunk with the given maximum requests per second
   * @param chunkSize The maximum requests per second of any phase
   * @returns {{chunk, remainder}} The Lambda-sized chunk that was removed from the script and the remaining
   * script to execute
   */
  splitScriptByRequestsPerSecond: (script, chunkSize) => {
    const ret = {
      chunk: JSON.parse(JSON.stringify(script)),
      remainder: JSON.parse(JSON.stringify(script)),
    }
    let phaseParts
    let i
    let j
    ret.chunk.config.phases = []
    ret.remainder.config.phases = []
    for (i = 0; i < script.config.phases.length; i++) {
      phaseParts = planning.splitPhaseByRequestsPerSecond(script.config.phases[i], chunkSize)
      for (j = 0; j < phaseParts.chunk.length; j++) {
        ret.chunk.config.phases.push(phaseParts.chunk[j])
      }
      for (j = 0; j < phaseParts.remainder.length; j++) {
        ret.remainder.config.phases.push(phaseParts.remainder[j])
      }
    }
    return ret
  },
  /**
   * Split the given event by duration using the given settings
   * @param timeNow The time identity to use in logging activity
   * @param event The script to split and schedule the chunks of
   * @param settings The settings to use for splitting the script
   * @returns {*|{chunk, remainder: *}}
   */
  splitScriptByDurationInSecondsAndSchedule: (timeNow, event, settings) => {
    const script = event
    // SPLIT
    if (script._trace) {
      console.log(`splitting script by duration from ${script._genesis} in ${timeNow} @ ${Date.now()}`)
    }
    const parts = planning.splitScriptByDurationInSeconds(script, settings.maxChunkDurationInSeconds)
    // SCHEDULE
    if (!parts.chunk._start) {
      parts.chunk._start = timeNow + settings.timeBufferInMilliseconds
    }
    if (script._trace) {
      console.log(`scheduling immediate chunk start from ${script._genesis} in ${timeNow} for execution @ ${parts.chunk._start}`)
    }
    // kick the reminder off timeBufferInMilliseconds ms before the end of the chunk's completion
    parts.remainder._start = parts.chunk._start + (settings.maxChunkDurationInSeconds * 1000)
    if (script._trace) {
      console.log(`scheduling future chunk start from ${script._genesis} in ${timeNow} for execution @ ${parts.remainder._start}`)
    }
    return parts
  },
  /**
   * Split the given event by requests per second using the given settings
   * @param timeNow The time identity to use in logging activity
   * @param event The script to split and schedule the chunks of
   * @param settings The settings to use for splitting the script
   * @returns {ScriptChunk[]} The scripts into which the given event was split
   */
  splitScriptByRequestsPerSecondAndSchedule: (timeNow, event, settings) => {
    const plan = []
    let script = event
    let scriptRequestsPerSecond
    const initialLength = plan.length
    if (script._trace) {
      console.log(`splitting immediate chunk by requests per second from ${script._genesis} in ${timeNow} @ ${Date.now()}`)
    }
    if (!script._start) {
      script._start = timeNow + settings.timeBufferInMilliseconds // eslint-disable-line no-param-reassign
    }
    do {
      const parts = planning.splitScriptByRequestsPerSecond(script, settings.maxChunkRequestsPerSecond)
      plan.push(parts.chunk)
      script = parts.remainder
      scriptRequestsPerSecond = planning.scriptRequestsPerSecond(script) // determine whether we need to continue chunking
    } while (scriptRequestsPerSecond > 0)
    if (script._trace) {
      console.log(`immediate chunk split in to ${plan.length - initialLength} chunks, with ${initialLength} future chunk(s) from ${script._genesis} in ${timeNow} @ ${Date.now()}`)
    }
    return plan
  },
  // ######################
  // ## SERVICE SAMPLING ##
  // ######################
  /**
   * Split the given script into an array of scripts, one for each flow in the given script, each specifying the
   * execution of the single contained flow exactly once.
   * @param script The script to split.  Note that the
   * @param settings The settings to use in generating phases for each script
   * @returns {Array} An array of scripts that each contain a single flow from the original script and specify its
   * execution exactly once.
   */
  splitScriptByFlow: (script) => {
    let i
    let last = 0
    const scripts = []
    let newScript
    const oldScript = JSON.parse(JSON.stringify(script))
    oldScript.mode = modes.PERF
    delete oldScript.config.phases
    for (i = 0; i < oldScript.scenarios.length; i++) { // break each flow into a new script
      // there is a non-standard specification in artillery where you can specify a flow as a series of array entries
      // that will be composed for you.  Something like:
      //   [
      //     name: 'foo',
      //     weight: 1,
      //     flow: { ... },
      //     name: 'bar',
      //     weight: 2,
      //     flow: { ... }
      //   ]
      // is interpreted as:
      //   [
      //     { name: 'foo', weight: 1, flow: { ... } },
      //     { name: 'bar', weight: 2, flow: { ... } }
      //   ]
      // for completeness, this logic accounts for that valid (though inadvisable) script format
      if (oldScript.scenarios[i].flow) {
        newScript = JSON.parse(JSON.stringify(oldScript))
        newScript.config.phases = planning.generateSamplingPhases(script.sampling) // do this for every script so that they don't act in sync and create harmonic effects
        newScript.scenarios = oldScript.scenarios.slice(last, i + 1)
        last = i + 1
        scripts.push(newScript)
      }
    }
    return scripts
  },
  /**
   * Generate a series of sampling phases with pauses between them according to the given settings
   * @param script The script for which sampling phases are to be generated
   * @param sampling The settings to use in generating phases for the given script
   * @returns {Array} The generated sample phases for the given script
   */
  generateSamplingPhases: (sampling) => {
    const phases = []
    // Note: rather than generating these times ourselves, we could use the poisson distribution feature but we want an exact number of executions
    // in order to facilitate simple thresholding on the number of successes in a manner that is predictable and legible to users
    for (let i = 0; i < sampling.size; i++) {
      // Add a pause (even the first time) so as to avoid walls of requests
      // Math.random => [0, 1]
      // [0, 1] * 2 => [0, 2]
      // [0, 2] * pauseVariance => [0, 2 * pauseVariance]
      let pause = (Math.random() * 2 * sampling.pauseVariance)
      // [0, 2 * pauseVariance] - pauseVariance => [-pauseVariance, +pauseVariance]
      pause -= sampling.pauseVariance
      // [-pauseVariance, +pauseVariance] + averagePause => [averagePause - pauseVariance, averagePause + pauseVariance]
      pause += sampling.averagePause
      phases.push({ pause })
      phases.push({ duration: 1, arrivalRate: 1 }) // exactly once (settings.task.sampling.size times)
    }
    return phases
  },
  // ##############
  // ## PLANNING ##
  // ##############
  /**
   * Create an execution plan for a performance mode script
   * @param timeNow The time identity to use in logging activity
   * @param script The script to split and schedule the chunks of
   * @param settings The settings to use for splitting the script
   * @returns {ScriptChunk[]} The script chunks obtains from splitting the script (if appropriate) by duration and requests per second
   */
  planPerformance: (timeNow, script, settings) => {
    const plan = []
    let updatedScript = planning.ensureScriptGenesis(script, timeNow)

    // ## Duration ##
    const scriptDurationInSeconds = planning.scriptDurationInSeconds(updatedScript)

    // if there is more script to execute than we're able to complete in a single execution, chomp off the initial executable
    // duration of that script as the current executable of our plan.
    if (scriptDurationInSeconds > settings.maxChunkDurationInSeconds) {
      const parts = planning.splitScriptByDurationInSecondsAndSchedule(timeNow, updatedScript, settings)
      updatedScript = parts.chunk
      plan.push(parts.remainder)
    }

    // ## Requests Per Second ##
    const scriptRequestsPerSecond = planning.scriptRequestsPerSecond(updatedScript)

    // if the current script can be executed in a single run add it to the plan, otherwise, remove chunks that can be,
    // adding them to the plan until no more script remains
    if (scriptRequestsPerSecond <= settings.maxChunkRequestsPerSecond) {
      plan.push(updatedScript)
    } else {
      const parts = planning.splitScriptByRequestsPerSecondAndSchedule(timeNow, updatedScript, settings)
      plan.push.apply(plan, parts) // eslint-disable-line prefer-spread
    }

    return plan
  },
  /**
   * Plan for executing a set of samples for each unique flow in the given script where each sample
   * executes its unique flow once
   * @param timeNow The time at which the event was received for this execution
   * @param script The Artillery (http://artillery.io) script to split into acceptance tests
   * @param settings Execution environment and script constraints
   * @returns {*|Array} The scripts to execute as part of this sample plan
   */
  planSamples: (timeNow, script, settings) => {
    const updatedScript = planning.ensureScriptGenesis(script, timeNow)

    updatedScript._start = timeNow // immediate execution
    updatedScript._invokeType = 'RequestResponse' // we care about the results (and will record/analyze them)

    return planning.splitScriptByFlow(updatedScript, settings)
  },

  ensureScriptGenesis: (script, timeNow) =>
    Object.assign(script, {
      _genesis: script._genesis === undefined ? timeNow : script._genesis,
    }),
}

module.exports = planning
