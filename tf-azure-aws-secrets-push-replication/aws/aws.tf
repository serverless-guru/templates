
module "secrets-manager" {
  source  = "terraform-aws-modules/secrets-manager/aws"
  version = "1.3.1"
}

data "aws_region" "current" {}

data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "lambda_secrets_policy" {
  statement {
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:PutSecretValue",
      "secretsmanager:UpdateSecret",
      "secretsmanager:DeleteSecret"
    ]
    resources = [
      "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:demo/*"
    ]
  }
}

resource "random_uuid" "lambda_bucket_name" {
}


resource "aws_s3_bucket" "lambda_bucket" {
  bucket = "tf-aws-lambda-${random_uuid.lambda_bucket_name.result}"
}

resource "aws_s3_bucket_ownership_controls" "lambda_bucket_ownership_controls" {
  bucket = aws_s3_bucket.lambda_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "lambda_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.lambda_bucket_ownership_controls]

  bucket = aws_s3_bucket.lambda_bucket.id
  acl    = "private"
}

resource "archive_file" "lambda_update_secrets_archive" {
  type             = "zip"
  source_file      = "${path.module}/aws-lambda/update-secrets.js"
  output_file_mode = "0666"
  output_path      = "${path.module}/update-secrets.zip"
}

resource "aws_s3_object" "lambda_update_secrets_s3" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "update-secrets.zip"
  source = archive_file.lambda_update_secrets_archive.output_path

}

resource "aws_lambda_function" "lambda_update_secrets" {
  function_name = "update-secrets"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_update_secrets_s3.key

  runtime = "nodejs20.x"
  handler = "update-secrets.handler"

  source_code_hash = archive_file.lambda_update_secrets_archive.output_base64sha256

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_cloudwatch_log_group" "lambda_update_secrets" {
  name = "/aws/lambda/${aws_lambda_function.lambda_update_secrets.function_name}"
  retention_in_days = 1
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "lambda_secrets_policy" {
  name        = "lambda_secrets_policy"
  description = "Policy for updating secrets in Secrets Manager"
  policy      = data.aws_iam_policy_document.lambda_secrets_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_secrets_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_secrets_policy.arn
}

resource "aws_apigatewayv2_api" "azure_aws_secrets_replication_demo" {
  name          = "azure-aws-secrets-replication-demo"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "azure_aws_secrets_replication_demo_stage" {
  api_id = aws_apigatewayv2_api.azure_aws_secrets_replication_demo.id

  name        = "dev"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_integration" "update_secrets" {
  api_id = aws_apigatewayv2_api.azure_aws_secrets_replication_demo.id

  integration_uri    = aws_lambda_function.lambda_update_secrets.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  
}

resource "aws_apigatewayv2_route" "set_secret" {
  api_id             = aws_apigatewayv2_api.azure_aws_secrets_replication_demo.id

  route_key          = "POST /set-secret"
  target             = "integrations/${aws_lambda_function.lambda_update_secrets.id}"
  authorization_type = "AWS_IAM"

}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.azure_aws_secrets_replication_demo.name}"

  retention_in_days = 1
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_update_secrets.function_name
  principal     = "apigateway.amazonaws.com"

    source_arn = "arn:aws:execute-api:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${aws_apigatewayv2_api.azure_aws_secrets_replication_demo.id}/*/*"

  # source_arn = "${aws_lambda_function.lambda_update_secrets.invoke_arn}"
}

resource "aws_iam_role" "azure_function_role" {
  name = "azure_function_role"
  description = "Role for Azure Function to access AWS Secrets Manager"
  assume_role_policy = <<EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }
  EOF
}