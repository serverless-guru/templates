### Protect AWS API Gateway from DDoS with AWS WAF via Serverless Framework

In this template, we demonstrate below AWS services:
- Amazon API Gateway
- AWS Lambda
- AWS WAF

Use Cases Covered:
- Prevent HTTP Flood DDos Attack on API Gateway Using AWS WAF Web ACL Rate-Based Rule

### Deploy
`serverless deploy`

### This Serverless Framework Template IaC will Create
- 1 REST API in API Gateway along with Lambda Function
- 1 AWS WAF Regional Web ACL with Rate-Based Rule to Prevent HTTP Flood DDos Attack
- Associate WAF Web ACL with API Gateway of current stack

#### This POC Demo API call use cases details (Test your WAF Web ACL Enabled Secure APIs)
1. Do a normal call to your API Gateway APIs endpoint and it should give response data
**WAF Allows: ** `{
    "message": "WAF protected API Call Response!"
}
`

2. Use [Artillery](https://www.artillery.io/) tool to send a large number of requests in a short period to trigger your rate limit rule: `$artillery quick -n 2000 --count 10 https://XXXXXXXXXX.execute-api.us-east-1.amazonaws.com/dev/todo/list
`
Using this command, Artillery sends 2000 requests to your API from 10 concurrent users. By doing this, you trigger the rate limit rule in less than the 5-minute threshold. Once Artillery finishes its execution, re-running the API and API response will be:
**WAF Blocked:** `{"message":"Forbidden"}`