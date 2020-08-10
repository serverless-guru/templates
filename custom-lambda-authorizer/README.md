# Custom Lambda Authorizer

## Purpose

Demonstrate an AWS Lambda Custom Authorizer mixed in with a complex API Gateway deployment and multi-stage param values being passed in.

This is also for scenarios where you have existing Cognito User Pool that you're trying to attach too.

However you could easily update the `params.yml` under the specific stage to instead of pulling a hardcoded value, pull in an output from CloudFormation.

## ID Token Authentication

You can find an example `authorizer.js` lambda file for id token authentication under `cognito-id-token`

## Access Token Authentication

You can find an example `authorizer.js` lambda file for access token authentication under `cognito-access-token`