const aws = require('aws-sdk') // eslint-disable-line import/no-extraneous-dependencies

const sns = new aws.SNS()

const alert = {
  briefAnalysis: (analysis) => {
    const latencies = []
    analysis.reports.forEach((report, i) => {
      const current = report
      latencies[i] = current.latencies
      delete current.latencies
    })
    const ret = JSON.stringify(analysis, null, 2)
    analysis.reports.forEach((report, i) => {
      const current = report
      current.latencies = latencies[i]
    })
    return ret
  },
  send: (script, analysis) => {
    if (!process.env.TOPIC_ARN) {
      console.error([
        '#########################################################',
        '##         ! Required Configuration Missing !          ##',
        '## in order to send the alert, an environment variable ##',
        '## TOPIC_ARN must be available.  An alert was supposed ##',
        '## to be sent but one cannot be sent!                  ##',
        '#########################################################',
      ].join('\n'))
      return Promise.resolve()
    } else {
      const subject = `Alert: ${analysis.errorMessage}`
      const message = `Alert:
  ${analysis.errorMessage}

Logs:
Full analysis:
${alert.briefAnalysis(analysis)}
`
      const params = {
        Subject: subject,
        Message: message,
        TopicArn: process.env.TOPIC_ARN,
      }
      return sns.publish(params).promise()
    }
  },
}

module.exports = alert
