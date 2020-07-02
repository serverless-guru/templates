# How to setup Dynatrace on Lambda functions

## Video Walkthrough
- [Video Walkthrough Link](https://www.loom.com/share/c37ebf1189ac4477a0b3c46fff520997)

## Summary
Dynatrace has 2 methods for instrumenting Lambda functions:
- 2018 Method
- 2020 Method

Currently, the 2018 method works, the suggested 2020 method is currently incomplete
and undocumented. We suggest using the 2018 method until Dynatrace makes more 
knowlegde available around the new 2020 method.


## The Problem
Dynatrace's documentation is inconsistant. There is the 2018 method which is well documented, but is obsolete, there is the 2020 method. 

Lets first describe the 2018 method:

## 2018 Method
#### Helpful Links
- [npm oneagent package](https://www.npmjs.com/package/@dynatrace/oneagent)
- [Curent Lambda Integration Docs](https://www.dynatrace.com/support/help/technology-support/cloud-platforms/amazon-web-services/installation/integrate-nodejs-lambda-functions/)
- [Youtube Walkthrough Video](https://www.youtube.com/watch?v=0Y4yZQIpDUQ)

#### Description
When reading the Lambda Integration Docs above, you will see instructions to click `Deploy Dynatrace`, and then click `Setup Serverless Integration` in the Dynatrace console. If you follow those instructions you will not be able to see the `Setup Serverless Integration` button. If you watch the youtube video listed above from 2018, you will be able to see that after clicking that button, you will be instructed to:

- 1. Install Dynatrace NPM Module in your project root.
- 2. In your AWS console, open the Lambda and change your handler function to `node_modules/@dynatrace/oneagent.index$handler`
- 3. Add the `DT_LAMBDA_OPTIONS` environment variable to the lambda function.

These instructions are no longer correct. Instead, we use the oneagent library as normal.

## 2020 Method
#### Helpful Links
- [npm oneagent package](https://www.npmjs.com/package/@dynatrace/oneagent)

#### Description
Instead, we simply follow the normal oneagent npm module instructions for lamda. At the top of our lambda function, we do the following:

```js
module.exports.main = async event => {
  try {
    require('@dynatrace/oneagent')({
      environmentid: '****',
      apitoken: '****',
    });
  } catch (err) {
    console.log('Failed to load OneAgent: ' + err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!'
      }
    )
  }
}
```



