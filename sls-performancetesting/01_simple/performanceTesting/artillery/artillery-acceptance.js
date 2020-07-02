const sampling = require('./sampling.js')
const planning = require('./planning.js')
const analysis = require('./analysis.js')

const artilleryAcceptance = artilleryTask => ({
  execute: (timeNow, script, settings) => {
    const acceptanceScript = sampling.applyAcceptanceSamplingToScript(script, settings)

    const plans = planning.planSamples(timeNow, acceptanceScript, settings)

    return artilleryTask
      .executeAll(acceptanceScript, settings, plans, timeNow)
      .then(results => analysis.analyzeAcceptance(timeNow, acceptanceScript, settings, results))
  },
})

module.exports = artilleryAcceptance
