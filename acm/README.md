# AWS ACM

## Description

This `serverless.yml` will deploy an AWS ACM SSL certifcate for the us-east-1 region which is required for edge-optimized API Gateway and CloudFront.

[Documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html)

## Deploy Process

### 1. Deploy Stack

```console
$ sls deploy -v
```

### 2. Validate ownership of domain

When you use the `AWS::CertificateManager::Certificate` resource in an AWS CloudFormation stack, the stack will remain in the `CREATE_IN_PROGRESS` state. Further stack operations will be delayed until you validate the certificate request, either by acting upon the instructions in the validation email, or by adding a CNAME record to your DNS configuration.

1. Go to AWS ACM console

2. Expand your AWS ACM certificate

3. Click the `Create record in Route 53` button (this will automatically create the CNAME for you)

4. Wait (After your DNS provider propagates your record update, it can take up to several hours for ACM to validate the domain name and issue the certificate.)

[Documentation](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html)

### 3. Deploy the frontend/backend stack

When you've finished validating ownership of the domain. The `acm` stack should finish deploying. Now you can deploy the backend and frontend stacks as they are using the `SSLCertArn`.