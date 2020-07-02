# Reuse an Existing API Gateway Stage

## Generic setup
```yml
provider:
  name: aws
  runtime: nodejs12.x
  stage: ${opt:stage, "dev"}
  region: ${opt:region, "us-east-1"}
  apiGateway:
    restApiId: ${self:custom.restApiId}
    restApiRootResourceId: ${self:custom.restApiRootResourceId}
custom:
  restApiId: xyz # <-- Add your existing API Gateway REST API ID
  restApiRootResourceId: xyz # <-- Add your existing API Gateway REST API Root Resource ID (e.g. path of / id)
  restApiStageName: existing  # <-- change to your existing deployment stage name
functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: /hello
          method: GET
resources:
  Resources:
    StageDeployment:
      DependsOn: ApiGatewayMethodHelloGet  # <-- replace based on your function method name which is created by serverless framework (found by searching for "ApiGatewayMethod" in .serverless/ folder)
      Type: AWS::ApiGateway::Deployment
      Properties:
        RestApiId: ${self:custom.restApiId}
        Description: Reuse ${self:custom.restApiStageName} deployment
        StageName: ${self:custom.restApiStageName}
```

## Key changes to note
* The stage name is defined in the custom block - `self:custom.restApiStageName`
* The Stage deployment is defined as a new CloudFormation resource.
    * `DependsOn` refers to both the function **and** the http method. Is based on your function method name which is created by serverless framework, and can be found by searching for "ApiGatewayMethod" in .serverless/ folder.
    * The `RestApiID` is the same that is defined in the custom block.
    * `StageName` is defined in the custom block as well, but takes a string. 

Deploying with this in place will add the applicable function methods to the stage you define.