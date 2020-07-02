#! /bin/bash

# Example usage: npm run build dev us-west-2 => bash ./scripts/build.bash dev us-west-2

# Variables
service_name="angularjs-app"
stage=$1
region=$2
profile="default"

# Default stage if not passed
if [[ -z $stage ]];
then
    stage="dev"
fi

# Default region if not passed
if [[ -z $region ]];
then
    region="us-west-2"
fi

echo "Deploying to S3 in $stage and $region"

# Render files from html
if [[ $stage == "prod" ]];
then
  yarn build:prod
else
  yarn build 
fi

# Extra debug logs
export SLS_DEBUG="*"

# Deploy to S3
serverless deploy --region $region --stage $stage -v

# aws s3 ls
aws s3 sync dist/$service_name s3://$service_name-$stage-website --profile $profile

# Get the cloudfront_id from the AWS Cloudformation Output
cloudfront_id=$(aws cloudformation list-exports --query "Exports[?Name==\`$service_name:$stage:CloudFrontId\`].Value" --no-paginate --output text --region $region --profile $profile)

echo "CloudFront Distribution ID: $cloudfront_id"

# Tell CloudFront to invalidate all files to update the website immediately rather than waiting for 24 hours
aws cloudfront create-invalidation --distribution-id $cloudfront_id --paths '/*' --region $region --profile $profile