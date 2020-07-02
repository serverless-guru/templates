# Code Challenge

#### Time: spend what you think is a "reasonable amount of time"

Take this AWS SAM template and turn it into Serverless Framework. High level instructions below.

* [Result](#result)

* [Goal](#goal)

* [Bonus](#bonus)

## Result

* API Gateway + Lambda function isolated

* VPC isolated

* Database isolated

* (optional) Permissions isolated

* Everything deploys properly

## Goal

1. Convert this AWS SAM template to Serverless Framework

2. Remove all unecessary resources that Serverless Framework creates automatically

3. Replace all intrinsic functions with the Serverless Framework equivalent

4. Update all AWS resource names to be dynamic by stage

5. Update all hardcoded region/stage values to be dynamic

5. Split the resources up into separate serverless.yml files based on logical groupings and isolation of resources

6. Use Serverless Framework to add X-Ray tracing, API Gateway REST API logging, and lambda 
packaging to only include the index.js file

7. Add dynamic stage/region flags

8. Send over to Serverless Guru for review

## Bonus

1. Add Serverless Framework Pro outputs to have each isolated serverless.yml communicate together

2. Setup Serverless Framework Pro AWS IAM role deployments versus using a local profile

3. Move the clientId and clientSecret to Serverless Framework Pro profiles for dev and prod
