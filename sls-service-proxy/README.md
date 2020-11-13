# Serverless API Gateway Service Proxy Plugin

## Purpose

Deploy Serverless application with `serverless-apigateway-service-proxy` configured to be able to 
send messages to a SQS queue via API Gateway rest endpoint, without the need of a Lambda function. 

This examples shows how to use it with SQS, but you can also use with:

```
Kinesis Streams
S3
SNS
DynamoDB (PutItem, GetItem and DeleteItem)
EventBridge
```

For more examples, check the documentation right here: https://github.com/serverless-operations/serverless-apigateway-service-proxy

## When should I consider using it?

If you are using a Lambda function that has the only responsibility to call one of the listed services and return the response, and you are already having troubles with cold start latency and high costs, you should definitely consider to use it.

## Diagram

![image](https://user-images.githubusercontent.com/232648/99114925-630aa780-25d0-11eb-9c44-3b64ff05138d.png)

## Commands

`sls deploy`