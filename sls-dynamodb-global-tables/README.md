# DynamoDB Global Tables
This template creates DynamoDB Global Tables with an HTTP API Gateway and Lambda. This code was used for our webinar from the 16th September 2021.

This template is for [Serverless](https://serverless.com) allowing to easily separate each function into it's own dedicated file or folder by using this [boilerplate](https://github.com/DanielMuller/serverless-template-aws-webpack-nodejs).

The template is for [NodeJS 14.x](https://nodejs.org/) and it uses [webpack plugin](https://github.com/serverless-heaven/serverless-webpack) to reduce each packaged function.

# Deploy
* Create the satge config:
  ```
  cp stages/dev.sample.yml stages/dev.yml
  ```

* Edit stages/dev.yml to suit your needs

* Change your main region in the condition definition in `serverless.yml` if needed.

* Comment the additional regions in `resources/dynamoDb/comments.yml`:
  ```yaml
  Replicas:
    - Region:
        Ref: AWS::Region
    # - Region: eu-central-1
    # - Region: us-east-2
  ```

  This is a limitation of AWS. You can't create more than 1 replica at a time.

* Deploy your stack to your main region:
  ```
  sls -r ap-southeast-2 deploy
  ```
  This will create DynamoDB, API Gateway, Lambda, ACM and Route53 in ap-southeast-2

* Uncomment 1 region in `resources/dynamoDb/comments.yml`:
  ```yaml
  Replicas:
    - Region:
        Ref: AWS::Region
    - Region: eu-central-1
    # - Region: us-east-2
  ```
* Deploy again:
  ```
  sls -r ap-southeast-2 deploy
  ```
* This will create a DynamoDB replica in eu-central-1

* Uncomment the last region
  ```yaml
  Replicas:
    - Region:
        Ref: AWS::Region
    - Region: eu-central-1
    - Region: us-east-2
  ```

* Deploy to all 3 regions:
  ```
  sls -r ap-southeast-2 deploy && sls -r eu-central-1 deploy && sls -r us-east-2 deploy
  ```
# Deploy code changes
Once the table is replicated, deploying code changes (or stack changes not related to DynamoDB) needs to be done in all regions:
  ```
  sls -r ap-southeast-2 deploy && sls -r eu-central-1 deploy && sls -r us-east-2 deploy
  ```
