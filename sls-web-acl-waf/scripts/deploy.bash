#!/bin/bash

# set bash to stop if error happen
set -e

stage=$1
region=$2
profile="serverlessguru-internal"
web_acl_service="sls-web-acl-waf"
api_gateway_service="sls-api-gateway-waf"

# default env if not passed
if [[ -z $stage ]];
then
    stage="dev"
fi

# default region if not passed
if [[ -z $region ]];
then
    region="ca-central-1"
fi

sls deploy -v --profile $profile

# import webaclwithamrarn
web_acl_arn=$(aws cloudformation list-exports --query "Exports[?Name==\`$web_acl_service-$stage-WebACLWithAMRArn\`].Value" --no-paginate --output text --region $region --profile $profile)

# import api arn
resource_arn=$(aws cloudformation list-exports --query "Exports[?Name==\`$api_gateway_service-$stage-ApiArn\`].Value" --no-paginate --output text --region $region --profile $profile)

# associate web acl and api gateway
aws wafv2 associate-web-acl \
    --web-acl-arn $web_acl_arn \
    --resource-arn $resource_arn \
    --region $region --profile $profile

wait
echo "all done"