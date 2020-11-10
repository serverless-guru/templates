# Lambda Extension

## NOTE: Pattern is setup with Serverless Pro for deployments

```yaml
# Remove these lines from serverless.yml to not use Serverless Pro
org: ...
app: ...
```

## Purpose

Create a lambda extension pattern that works with NodeJS12.x which will run code when the "shutdown" hook is triggerd.

## Template Overview

* `layers`
    * `elk` - elk extension layer
        * `elk-extension` - nodejs code to do something when the hook is triggered
            * `extensions-api.js` - handles **register** and **next**
            * `index.js` - handles registering the extension and business logic for **EventType.SHUTDOWN** and **EventType.INVOKE**
        * `extensions` - executable that starts the process
        * `serverless.yml` - defines IAC for creating the lambda extension layer
* `serverless.yml` - defines a sample lambda which will have the ELK extension layer attached

## ELK Lambda Extension Layer Setup

```bash
$ cd layers/elk/elk-extension
$ chmod +x index.js
$ npm install
$ cd ../../../
```

### Deploy

**Login to Serverless Pro:**

```bash
$ sls login
```

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

## Relevant Docs

[Example Extension in NodeJS](https://github.com/aws-samples/aws-lambda-extensions/tree/main/nodejs-example-extension)