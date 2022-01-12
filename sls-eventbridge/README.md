# AWS Lambda Event Filtering & Scheduling Using Amazon EventBridge

In this template, we demonstrate below AWS services:
- AWS Lambda
- Amazon EventBridge (CloudWatch Events)

Use Cases Covered:
- Schedule lambda function calls using EventBridge
- Custom event pattern matching based lambda function calls using EventBridge

# This Serverless Framework template IaC will create
- 3 Lambda functions with EventBridge rule as Event Source Trigger
- 3 rules for default event bus in EventBridge

# Lambda trigger use case details
1. ‘scheduledService’ lambda function scheduled to call every 1 minute

2. ‘invoiceService’ lambda function will only call whenever custom event pattern matching:
{
"operation":"invoice-service"
}

3. ‘rewardService’ lambda function will only call whenever custom event pattern matching:
{
"operation":"reward-service"
}