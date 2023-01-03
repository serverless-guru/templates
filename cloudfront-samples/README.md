# Cloudfront use cases

Creates a Cloudfront distribution with different uses cases for Cloudfront functions and Lambda@Edge.

## Deployment
* Create `config/stages/dev.yml` using the provided samples
* Deploy Lambda@Edge functions
  `sls package -c serverless.edge.yml -p .serverless-edge`
  `sls deploy -p .serverless-edge`
* Deploy Cloudformation
  `sls deploy -c serverless.yml`
