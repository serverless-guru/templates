'use strict'
const AWS = require('aws-sdk')

module.exports = async ({ options, resolveVariable }) => {
  // Checking AWS user details
  const profile = await resolveVariable('self:provider.profile')
  const credentials = new AWS.SharedIniFileCredentials({ profile: profile })
  AWS.config.credentials = credentials
  const sts = new AWS.STS()
  const { Account: accountId } = await sts.getCallerIdentity().promise()
  return { accountId }
}
