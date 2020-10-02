# Serverless frontend (Angular/React/Vue) with CI/CD

## Summary
Following stack will create:
  - Test and Production S3 buckets with website hosting
  - CodeCommit repository 
  - CodeBuild projects with buildspec for master and development branch
  - CodePipelines for test and production
  - Hello world lambda function

## Instructions

There are few prerequisites that we need to take care of before we start and those are:

## Prerequisites
  - serverless pro account
  - aws profile 
  - CodeCommit credentials generated inside AWS IAM 

1. Clone ServerlessGuru templates repository
2. Copy sls-frontend-with-cicd to your project folder
3. Login to your serverless [dashboard](https://app.serverless.com) then create an app.
4. Go to the apps section, then click on your application name
5. On the right side of the screen, click on the three dots, then click on a settings
6.  Click on your default profile and there you will see the form where you can add parameters.
7. Create the following parameters:
    - repositoryName
    - testBucket
    - productionBucket
8. Update `serverless.yml` file `app` and `org` properties with your organization and application name 
9. run `./deploy.sh YOUR_REGION YOUR_AWS_PROFILE react|vue|angular` from your terminal

Example: `./deploy us-east-1 default vue`