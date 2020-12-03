# NOTE: CICD STACK NEEDS TO BE CREATED MANUALLY (IAM Deployment Role has admin access)

## Flow

1. Deploy this CICD Stack with AWS IAM USER and AWS IAM ROLE

2. Create Access Key and Secret Access Key for AWS IAM User in the AWS Console

3. Copy ACCESS KEY and SECRET ACCESS KEY of AWS IAM User to CI/CD as repository variables or environment variables

4. Configure bash script (already exists) to use the CICD AWS IAM USER ACCESS KEY and SECRET ACCESS KEY to assume the AWS IAM ROLE with deployment permissions

## Deployment

1. Create `.env` file with deploy creds (see `example .env` file)

2. Deploy - `bash ./scripts/deploy.bash [stage] [region] [deploy_path]`

3. Remove - `bash ./scripts/remove.bash [stage] [region] [deploy_path]`

## After Deployment

1. Create Access Key and Secret Access Key for AWS IAM User in the AWS Console

2. Copy Access Key and Secret Access Key to BitBucket Pipeline Repository variables or your choosen CI/CD in the environment variable section

These credentials are what powers the CI/CD pipeline.