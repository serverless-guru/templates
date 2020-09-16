# Protecting API Endpoints

-   [Video Walkthrough](https://www.loom.com/share/132460868c0e41c581be35bbda7f02c9)

# Overview of Template

In this example, we are going to demonstrate 2 ways you can protect your API Endpoint

-   With API Keys (Best practices suggesting using more than an API key to protect an endpoint)
-   Wit Resource Policy

It is important to note that are other options for protecting your endpoint as well, all available options can be found in the following AWS Docs [here](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-to-api.html).

# Resources

-   [Overview of Access Control with API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-to-api.html)

-   [API Gateway API Key Documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html)
-   [Resource Policy Documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)

# Resource Policies Summary

Amazon API Gateway resource policies are JSON policy documents that you attach to an API to control whether a specified principal (typically an IAM user or role) can invoke the API. You can use API Gateway resource policies to allow your API to be securely invoked by:

-   Users from a specified AWS account.
-   Specified source IP address ranges or CIDR blocks.
-   Specified virtual private clouds (VPCs) or VPC endpoints (in any account).
