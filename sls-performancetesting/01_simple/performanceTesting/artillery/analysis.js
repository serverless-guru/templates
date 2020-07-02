const modes = require('./modes.js')
const sampling = require('./sampling.js')

const analysis = {
  getErrorBudget: (script, defaultErrorBudget) => {
    if (script && script.sampling && script.sampling.errorBudget !== undefined) {
      return script.sampling.errorBudget
    } else if (defaultErrorBudget !== undefined) {
      return defaultErrorBudget
    } else {
      return sampling.defaults.sampling.errorBudget
    }
  },

  /**
   * Analyze a set of sampling reports, each of which is the result of a sample battery's execution
   * results.
   * @param script Artillery script used
   * @param report The collection of reports to analyze
   * @param defaultErrorBudget Maximum number of errors allowed
   */
  analyzeSamples: (script, report, defaultErrorBudget) => {
    let reports

    if (report.reports) {
      reports = report.reports // eslint-disable-line prefer-destructuring
    } else {
      reports = [report]
    }

    const totals = {
      scenariosCreated: 0,
      scenariosCompleted: 0,
      requestsCompleted: 0,
      codes: {},
      errors: {},
    }

    const mergeReportPropertyCounts = property =>
      reports.forEach(test =>
        Object.keys(test[property]).forEach((key) => {
          const countForTest = test[property][key]
          const isNewKey = totals[property][key] === undefined

          if (isNewKey) {
            totals[property][key] = countForTest
          } else {
            totals[property][key] += countForTest
          }
        }))

    mergeReportPropertyCounts('codes')
    mergeReportPropertyCounts('errors')

    const accumulateReportTotals = property =>
      reports.forEach((test) => { totals[property] += test[property] })

    accumulateReportTotals('scenariosCreated')
    accumulateReportTotals('scenariosCompleted')
    accumulateReportTotals('requestsCompleted')

    const totalErrors = Object.keys(totals.errors).reduce((total, message) => total + totals.errors[message], 0)

    const errorBudget = analysis.getErrorBudget(script, defaultErrorBudget)

    const finalReport = {
      errors: totalErrors,
      reports,
      totals,
    }

    if (totalErrors > errorBudget) {
      finalReport.errorMessage = `${
        modes.getModeForDisplay(script)
      } failure: scenarios run: ${
        totals.scenariosCreated
      }, total errors: ${
        totalErrors
      }, error budget: ${
        errorBudget
      }`
    }

    return finalReport
  },

  /**
   * Analyze a set of reports, each of which is the result of an acceptance test's execution
   * @param timeNow Origin time of the artillery test
   * @param script Artillery script used
   * @param settings Platform settings used
   * @param results Results of the tests
   *
   * @returns Object
   */
  analyzeAcceptance: (timeNow, script, settings, results) =>
    analysis.analyzeSamples(script, results, sampling.defaults.acceptance.errorBudget),

  /**
   * Analyze a set of reports, each of which is the result of an monitoring test's execution
   * @param timeNow Origin time of the artillery test
   * @param script Artillery script used
   * @param settings Platform settings used
   * @param results Results of the tests
   *
   * @returns Object
   */
  analyzeMonitoring: (timeNow, script, settings, results) =>
    analysis.analyzeSamples(script, results, sampling.defaults.monitoring.errorBudget),

  /**
   * Analyze the performance results.  If there is one payload, then it is a report.  Otherwise, it is a set of payloads.
   * @param timeNow Origin time of the artillery test
   * @param script Artillery script used
   * @param settings Platform settings used
   * @param results Results of the tests
   *
   * @returns Object
   */
  analyzePerformance: (timeNow, script, settings, results) => {
    if (results && results.length === 1) {
      return results[0] // return the report
    } else if (results) {
      return results
    } else { // eslint-disable-next-line no-underscore-dangle
      return { message: `load test from ${script._genesis} successfully completed from ${timeNow} @ ${Date.now()}` }
    }
  },
}

module.exports = analysis
