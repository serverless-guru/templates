# Tutorial walk through of building a Serverless Component

* [Overview](#overview)

* [Breakdown](#breakdown)

* [Publish](#publish)

## Overview

The first place you should start is with the official [Serverless Framework documentation on components](https://github.com/serverless/components/tree/cloud). Then if you're looking for an _opinionated_ breakdown keep reading, starting with the [Breakdown](#breakdown).

## Breakdown

This is meant to act as a line-by-line breakdown of the core ingredients of making components.

### Top level files/directories

```console
$ ls
src/ examples/ serverless.component.yml ...
```

* The `src/` folder holds your component logic

* The `/examples` folder helps debug and build by keeping a local example

* The `serverless.component.yml` file is where you define your component for the serverless registry

### serverless.component.yml

```yaml
name: sample-component
version: 0.0.1
author: serverlessguru
org: serverless-guru
description: Sample Component Template to get started
keywords: aws, serverless, component, template
repo: https://github.com/serverless-guru/templates/tree/master/sls-component-starter
readme: ''
license: MIT
main: ./src
```

* `name` - is what will be published to the serverless registry

* `version` - is how you increment your component. You can't deploy another version `0.0.1` once it's published so the next update would need something like `0.0.2`

* `main` - this tells the `serverless publish` command where to look for your `serverless.js` file

The other fields such as `license`, `readme`, `repo`, `keywords`, `description`, `org`, `author`, etc. are all more of meta-tag properties. They may still be required, but the most important properties are `name`, `version`, and `main`.

### src/ directory

```console
$ ls src/
serverless.js utils.js package.json
```

* The `serverless.js` file is the component entry point

* The `utils.js` file holds our helper functions

* The `package.json` file holds our serverless component dependencies

* The `node_modules` file holds the dependencies our serverless component needs

Note: You DO NOT need to install the `aws-sdk` and `@serverless/core` dependencies even if you use them in your `serverless.js` file or `utils.js` file. They are automatically installed on the component environment.

#### src/serverless.js

```javascript
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

    this.status('Deploying')
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
    this.status('Removing')
    if (!this.state.bucket) {
      this.debug(`Aborting removal. Bucket name not found in state.`)
      return
    }
    const { s3 } = getClients(this.credentials.aws, this.state.region)
    this.debug(`Deleting stack ${this.state.stackName}.`)
    await removeS3Bucket(s3, this.state)
    this.state = {}
    await this.save()
    return {}
  }
}

module.exports = SampleComponent
```

The `serverless.js` file has a couple of core functions:

* `deploy` this function will trigger when someone runs `sls deploy`

* `remove` this function will trigger when someone runs `sls remove`

* `defaults` allows you to define what the values should be if they are not passed by the user in their `serverless.yml` file

* `this.status('Deploying')` - is a way to print a message in the CLI

* `this.debug('Aborting')` - is a way to print optional messages during deployment. All `this.debug` statements are printed in the CLI when using `sls deploy --debug`

* `this.state` - is a way to persist values between deployments, we can save state by using `this.save()` which will use whatever you've put into `this.state` during the execution. This function comes from the parent Class which we are inheriting from called `Component`.

* `this.credentials.aws` - is how we reference the AWS credentials object which was pulled in from our `.env` file or other source. We can then pass this credentials object to `aws-sdk` functions to create AWS resources or handle some other functionality.

* `module.exports = SampleComponent` - is how we make our component accessible, this line is required and should match the top of the file, e.g. `class SampleComponent`

#### src/utils.js

```javascript
const aws = require('aws-sdk')

/**
 * Get AWS clients
 * @param {object} credentials
 * @param {string} region
 * @returns {object} AWS clients
 */
const getClients = (credentials, region = 'us-east-1') => {
  const s3 = new aws.S3({ credentials, region })
  return {
    s3
  }
}

/**
 * Create S3 Bucket
 * @param {*} s3 
 * @param {*} config 
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property
 */
const createS3Bucket = (s3, config) => {
  return await s3.createBucket({
    Bucket: config.bucket,
    ACL: config.acl ? config.acl : 'private'
  }).promise();
}

/**
 * Remove S3 bucket
 * @param {*} s3 
 * @param {*} config 
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property
 */
const removeS3Bucket = (s3, config) => {
  return await s3.deleteBucket({
    Bucket: config.bucket
  }).promise();
}

module.exports = {
  getClients,
  createS3Bucket,
  removeS3Bucket
}
```

* `getClients` - takes our AWS credentials (e.g. `this.credentials.aws`), creates an instance of AWS S3 using the `aws-sdk`, and returns the AWS S3 client back to our `serverless.js` for further use.

* `createS3Bucket` - simply uses the AWS S3 client to create an AWS S3 bucket e.g. `s3.createBucket()`

* `removeS3Bucket` - simply uses the AWS S3 client to remove an AWS S3 bucket e.g. `s3.deleteBucket()`

* `config` - equals the arguments passed via our `serverless.yml` under the `inputs` section and any `defaults` or other properties we've added in the `serverless.js` file. We then use this `config` object to pass the AWS S3 client our bucket name (e.g. `config.bucket`)

#### src/package.json

```json
{
    "name": "sample-component",
    "version": "1.0.0",
    "main": "./serverless.js",
    "publishConfig": {
        "access": "public"
    },
    "scripts": {
        "lint": "eslint . --fix --cache"
    },
    "author": "Serverless Guru"
}
```

The `package.json` is pretty straight forward. We provide some meta-data like `author`, any `scripts` such as using `eslint`, and a `publishConfig` which sets the access to public.

If we had any dependencies here, you would see those reflected under `depedencies` or `devDependencies` respectively.

### examples/ directory

```console
$ ls examples
.env serverless.yml
```

* The `.env` file will hold your AWS credentials. AWS IAM role deployments are coming soon.

* The `serverless.yml` file will handle referencing your new serverless component and where you pass arguments.

#### examples/serverless.yml

```yaml
# serverless.yml

component: sample-component  # The name of the Component in the Registry
org: example-org             # Your Serverless Framework Org
app: example-app             # Your Serverless Framework App
name: sample-component-sg    # The name of your instance of this Component
stage: dev
inputs:
  bucket: ${app}-${name}-${stage}
```

As you can see above the `serverless.yml` file in our `examples/` directory is referencing a component called `sample-component` that will align with the `serverles.component.yml` at the root level of our project.

The `org` and `app` will align with our Serverless Framework Pro Organization and App name.

The `name` at the root level will specify the instance of this Component.

The `stage` will allow us to create multiple stage deployments of this component by using a reference syntax like `my-lambda-function-${stage}` which translates to `my-lambda-function-dev`.

The `inputs` section is where we feed arguments to our component. We are passing a single argument to the underlying `sample-component` called `bucket`. This `bucket` argument is the name of our AWS S3 bucket.

It's worth noting that we are able to reference other arguments in the `serverless.yml` by using a syntax like `${app}-${name}-${stage}`. This ensures that we are keeping some degree of uniformity.

#### examples/.env

```console
AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=XXX
```

The `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are derived from an AWS IAM User with the proper permissions to make a deployment. IMPORTANT: make sure that the `.env` file is in your `.gitignore`.

## Publish

When you're ready to publish your component you will need to increase the components version.

Old version:

```yaml
# serverless.component.yml
version: 0.0.1
```

New version:

```yaml
# serverless.component.yml
version: 0.0.2
```

You can then publish by running the following command at the root of your project.

```console
$ sls publish
```

Then you can update your example at `examples/basic/serverless.yml` by increasing the version.
