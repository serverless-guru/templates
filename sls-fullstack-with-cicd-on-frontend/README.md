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

CloudFormation template creates CodeCommit repository which is AWS Git service. Repository name is taken from Serverless Pro Dashboard Params. Your frontend application will be auto-created based on your framework selection. During app creation, local git repository will  be initialized and first commit will be done (react, vue and angular cli does that when you create an app). After that we are adding remote origin (connecting local git repo with remote on CodeCommit). Next step will create production build specification then commit and push updated source to the master branch. Next step creates development branch on the repo and repeats the same steps as for the master.

CloudFormation template creates two S3 buckets with hosting static website capability. One is for test environment and the other one is for production. Bucket names are taken from Serverless Pro Dashboard Params. 

Frontend application will be deployed to test and to production bucket. Whenever you push changes to master branch Pipeline will build and deploy your app to the production bucket. Push to development branch will build and deploy app to the test bucket. 

## Instructions

1. Login to your serverless [dashboard](https://app.serverless.com) then create an app.

2. Go to apps section, then click on your application name

3. On the right side click on the three dots -> settings. Click on your default profile, there you will see parameters.

4. Create the following parameters:
    - repositoryName
    - testBucket
    - productionBucket

5. Update serverless.yml file app and org properties

6. run `./deploy.sh YOUR_REGION YOUR_AWS_PROFILE react|vue|angular` from your terminal

Example: `./deploy.sh us-east-1 default vue`
