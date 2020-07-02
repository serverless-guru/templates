const { Component } = require('@serverless/core')

const {
  getClients,
  createS3Bucket,
  removeS3Bucket
} = require('./utils')

const defaults = {
  region: 'us-east-1'
}

class SampleComponent extends Component {
  async deploy(inputs) {

    await this.status('Deploying')
    const config = { ...defaults, ...inputs }
    config.timestamp = Date.now()
  
    const { s3 } = getClients(this.credentials.aws, config.region)

    const s3Result = await createS3Bucket(s3, config)
  
    let stackOutputs = {}
     
    this.state = {
      bucket: config.bucket,
      region: config.region
    }
    await this.save()
    return stackOutputs
  }

  async remove() {
    await this.status('Removing')
    if (!this.state.bucket) {
      await this.debug(`Aborting removal. Bucket name not found in state.`)
      return
    }
    const { s3 } = getClients(this.credentials.aws, this.state.region)
    await this.debug(`Deleting stack ${this.state.stackName}.`)
    await removeS3Bucket(s3, this.state)
    this.state = {}
    await this.save()
    return {}
  }
}

module.exports = SampleComponent
