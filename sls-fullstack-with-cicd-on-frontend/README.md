# Serverless full stack with CI/CD for frontend app (Angular/React/Vue)

## Prerequisites
  - serverless pro account
  - aws profile 
  - CodeCommit credentials generated inside AWS IAM 

## Summary
Following stack will create:
  - Test and Production S3 buckets with website hosting
  - CodeCommit repository 
  - CodeBuild projects with buildspec for master and development branch
  - CodePipelines for test and production
  - Hello world lambda function

Fronted application will be deployed to test and to production bucket. Whenever you push changes to master branch Pipeline will build and deploy your app to the production bucket. Push to development branch will build and deploy app to the test bucket. 

## Instructions

1. Loging to your serverless [dashboard](https://app.serverless.com) then create app.

2. Create the following parameters:
    - repositoryName
    - testBucket
    - productionBucket

3. Update serverless.yml file app and org properties

4. run `./deploy.sh YOUR_REGION YOUR_AWS_PROFILE react|vue|angular` from your terminal
