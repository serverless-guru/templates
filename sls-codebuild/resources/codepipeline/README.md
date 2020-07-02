# CodeBuild and CodePipeline Example

## What?

Creates an AWS CodePipeline which connects to GitHub repository and deploys a Serverless Framework project using AWS CodeBuild.

## Core Files

* `serverless.yml` -> creates two AWS IAM roles, CodeBuild Project, CodePipeline, and connects to GitHub repository

## CI/CD Flow

### Steps

1. Create a branch called `dev` in your GitHub repository

2. Create a GitHub OAuth token

3. Create a Serverless Framework Pro organization with a `dev` profile

4. Setup AWS IAM role deployments under the `dev` profile and create a set the required param values (see the `serverless.yml` for these)

5. Deploy the CI/CD to your AWS account, `sls deploy --stage dev --region us-west-2 -v`

6. Make a change in your GitHub repository and push to the `dev` branch

### Note

For each stage you're deploying to create a new git branch matching that name e.g. `dev`, `qa`, `prod`.