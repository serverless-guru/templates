### Terraform: Create And Deploy AWS Lambda

In this Terraform IaC Template, Demonstrate below AWS services:
- Lambda
- S3
- IAM
- CloudWatch

Use Cases Covered:
- Create And Deploy AWS Lambda Using Terraform

#### Terraform Initialization
`terraform init`

#### Terraform Apply
`terraform apply`

#### Terraform Destroy
`terraform destroy`

#### This Terraform Template IaC Code Will Create Below 8 Resources In AWS
- aws_s3_bucket.lambda_bucket
- aws_s3_bucket_acl.lambda_bucket_acl
- aws_s3_object.lambda_sg_demo
- random_pet.lambda_bucket_name
- aws_iam_role_policy_attachment.lambda_policy
- aws_iam_role.lambda_exec
- aws_cloudwatch_log_group.sg_demo
- aws_lambda_function.sg_demo