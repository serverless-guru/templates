# ELK Lambda Extension

## Purpose

Create a lambda extension pattern that sends function logs to destinations.

### Supported Destinations

- S3

## Template Overview

* `layers`
    * `elk` - elk extension layer
        * `elk-extension` - nodejs code to do something when the hook is triggered
            * `destinations`
                * `index.js` - Logic for mapping all registered destinations.
                * `s3.js` - Logic for sending the logs to a S3 bucket.
            * `extensions-api.js` - handles **register** and **next**
            * `logs-api.js` - Logic for subscribing to Lambda Logs API.
            * `http-server.js` - Logic for creating a local HTTP server.
            * `index.js` - handles registering the extension and subscribing to Lambda Logs API.
        * `extensions` - executable that starts the process
        * `serverless.yml` - defines IAC for creating the lambda extension layer
* `serverless.yml` - defines a sample lambda which will have the ELK extension layer attached

### Lambda function

Example Lambda - connected to ELK Lambda extension should emulate a real lambda which needs to push logs to a destination

```yaml
# Lambda that has ELK Extension attached
example:
    name: ${self:custom.base}-exampleLambda
    handler: index.handler
    events:
        - http:
            path: /example
            cors: true
            method: any
    layers:
        - ${cf:${self:custom.layerStackName}.ELKLambdaExtensionLayerLambdaLayerQualifiedArn}
```

## ELK Lambda Extension Layer Setup

Setup the `index.js` permissions.

```bash
$ cd layers/elk/elk-extension
$ chmod +x index.js
$ npm install
$ cd ../../../
```

Setup the `extensions` executable file which will call our NodeJS `index.js` file

```bash
$ cd layers/elk/extensions                 
$ chmod 755 elk-extension
```

## Extension destinations

Optional parameters:
- `EXTENSION_LOG_MAX_ITEMS` - The maximum number of events to buffer in memory. Default: 10000. Minimum: 1000. Maximum: 10000.
- `EXTENSION_LOG_TIMEOUT_MS` - The maximum time (in milliseconds) to buffer a batch. Default: 1000. Minimum: 100. Maximum: 30000.
- `EXTENSION_LOG_MAX_BYTES` - The maximum size (in bytes) of the logs to buffer in memory. Default: 262144. Minimum: 262144. Maximum: 1048576.

You can enable destinations via env variable.
```
EXTENSION_LOG_DESTINATIONS: "s3"
```

As example, S3 destination has been provided but it can be easily extended by adding custom destinations files under `destinations` folder.

Every destination has to expose a `sendLogs` method which accepts `logs` as parameter and returns a promise.
```js
const sendLogs = (logs) => {
    const fileName = S3_OBJECT_NAME + '-' + new Date().toISOString() + '.log'

    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: logs
    };

    return s3.upload(params).promise();
}
```

If you want to send logs to more than one destination, you can pass all destinations names separated by commas.
```
EXTENSION_LOG_DESTINATIONS: "s3,destination1,destination2"
```
> Note that the destination names must match the file names under destinations folder.


## S3 destination

With this destination, function logs that the Lambda function generates and writes to stdout or stderr are send to a S3 bucket. As this is an asynchronous system, logs for one invoke may be processed during the next invocation. Logs for the last invoke may be processed during the SHUTDOWN event.

### Configuration
This destination accepts the following params as environment variables:
- `EXTENSION_LOG_DESTINATION_S3_BUCKET_NAME` - bucket name to send the logs. (This bucket must exists and the Lambda function using this extension needs to have permissions to put objects into the bucket)

- `EXTENSION_LOG_DESTINATION_S3_OBJECT_NAME` - The prefix name to be used for the object. (Example of an S3 object: [EXTENSION_LOG_DESTINATION_S3_OBJECT_NAME]-2020-11-22T13:46:56.371Z.log)

### Deploy Layer

**Deploy:**

```bash
$ cd layers/
$ sls deploy --stage dev --region us-west-2 -v
$ cd ../
```

## Sample Lambda

```bash
$ sls deploy --stage dev --region us-west-2 -v 
```

## Testing

**Local**

```bash
$ sls invoke local -f example -d '{"headers":{"x-amzn-trace-id": "1234abcd"}}'
```

**Real Lambda**

```bash
$ sls invoke -f example -d '{"headers":{"x-amzn-trace-id": "1234abcd"}}'
```

**Get Logs from Real Lambda**

You can also trail logs by adding `-t` to the end, otherwise the command below will get the last log.

```bash
$ sls logs -f example
```

## Errors that you may face

```bash
$ sls invoke -f example -d '{"headers":{"x-amzn-trace-id": "1234abcd"}}' 
{
    "errorMessage": "RequestId: e7977454-f1e5-4970-ad0f-7da70665f51d Error: fork/exec /opt/extensions/elk-extension: permission denied",
    "errorType": "Extension.LaunchError"
}
```

**To fix this:**

```bash
$ cd layers/elk/extensions                 
$ chmod 755 elk-extension
```

#### References

* [Lambda Runtime Extensions API](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-extensions-api.html)
* [Building Extension for Lambda](https://aws.amazon.com/blogs/compute/building-extensions-for-aws-lambda-in-preview/)
* [Example Extension in NodeJS](https://github.com/aws-samples/aws-lambda-extensions/tree/main/nodejs-example-extension)
* [AWS Lambda Logs API](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-logs-api.html)