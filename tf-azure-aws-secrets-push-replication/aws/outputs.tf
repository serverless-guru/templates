output "lambda_bucket_name" {
  description = "Name of the S3 bucket used to store function code."

  value = aws_s3_bucket.lambda_bucket.id
}

output "azure_function_role_arn" {
  description = "ARN of the IAM role used by the AWS Lambda function."

  value = aws_iam_role.azure_function_role.arn
}

output "aws_region" {
  description = "AWS region where resources are deployed."

  value = data.aws_region.current.name
}

output "aws_api_id" {
  description = "ID of the API Gateway used to trigger the AWS Lambda function."

  value = aws_apigatewayv2_api.azure_aws_secrets_replication_demo.id
}