# Custom Domain API Gateway

## Why?

Will create three separate stacks:

* CDN stack with the API Gateway Custom Domain + Route53 A record

* Base API with 4XX/5XX CORS, API Key, SLS Pro outputs for reuse across services

* Service A with a single Lambda function that attaches to the base API