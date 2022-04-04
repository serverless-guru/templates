# Serverless SQS Fifo Queue consumer

## Purpose

This project creates an Api Gateway directly connected to a SQS Fifo queue, a Dead Letter Queue and also a consumer to it with the power to connect in a RDS instance running in a private subnet with credentials configured over AWS Secrets Manager.

![image](https://user-images.githubusercontent.com/232648/102089338-d3d4f780-3dfa-11eb-9e2b-da381c32ec52.png)

The default value of the `batchSize` is 10 and we are consuming a batch of messages instead a single one. If you want more informations about it, just check this [blog post](https://www.serverlessguru.com/blog).

## Commands

### Requirements

- You need to have a RDS Instance already created and retrieve the values of `VPC_ID`, `SUBNET_IDS` and `SECURITY_GROUP_IDS` from it. With this values in hand, you need to add them into `serverless.yml` file;

- You need to create a new input over AWS Secrets Manager, with `host`, `username` and `password` to be able to connect to the RDS instance;

### Deploying

```bash
serverless deploy --stage <YOUR_STAGE> -v
```

### Usage

After the deploy it will output an HTTP Endpoint like this:
![image](https://user-images.githubusercontent.com/232648/102090439-3e3a6780-3dfc-11eb-86ee-734fce2e8ac2.png)

When you call this endpoint sending a JSON object over the body, it should place this message over your SQS Fifo queue and it will be going to be consumed by the `index.js` code.

### Load Tests

You can also check for a file called `artillery/script.yml` file in the repository. If you want to run a stress test over your setup, you can use this file with [serverless-artillery](https://github.com/Nordstrom/serverless-artillery). You will need to fill the props `target` and `url` with the values of your deployment.