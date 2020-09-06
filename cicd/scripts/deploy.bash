#! /bin/bash

# Assume Role - https://aws.amazon.com/premiumsupport/knowledge-center/iam-assume-role-cli/

CICD_ROLE_ARN="arn:aws:iam::account-id:role/cicd-<stage>-role"
CICD_USER_AWS_ACCESS_KEY="XXXXXXXXXXXXXXX"
CICD_USER_AWS_SECRET_ACCESS_KEY="xxxxxxxxxxxx"

stage=$1
region=$2
deploy_path=$3

if [[ -z $stage ]];
then
    echo "missing stage arg"
    exit 1
fi

if [[ -z $region ]];
then
    echo "missing region arg"
    exit 1
fi

if [[ -z $deploy_path ]];
then
    echo "missing deployment folder path"
    exit 1
fi

# Source .env if local
source .env

if [[ $stage == 'dev' ]];
then
    CICD_ROLE_ARN=$DEV_CICD_ROLE_ARN
    CICD_USER_AWS_ACCESS_KEY=$DEV_CICD_USER_AWS_ACCESS_KEY
    CICD_USER_AWS_SECRET_ACCESS_KEY=$DEV_CICD_USER_AWS_SECRET_ACCESS_KEY
elif [[ $stage == 'staging' ]];
then
    CICD_ROLE_ARN=$STAGING_CICD_ROLE_ARN
    CICD_USER_AWS_ACCESS_KEY=$STAGING_CICD_USER_AWS_ACCESS_KEY
    CICD_USER_AWS_SECRET_ACCESS_KEY=$STAGING_CICD_USER_AWS_SECRET_ACCESS_KEY
elif [[ $stage == 'prod' ]];
then
    CICD_ROLE_ARN=$PROD_CICD_ROLE_ARN
    CICD_USER_AWS_ACCESS_KEY=$PROD_CICD_USER_AWS_ACCESS_KEY
    CICD_USER_AWS_SECRET_ACCESS_KEY=$PROD_CICD_USER_AWS_SECRET_ACCESS_KEY
fi

export AWS_ACCESS_KEY_ID=$CICD_USER_AWS_ACCESS_KEY
export AWS_SECRET_ACCESS_KEY=$CICD_USER_AWS_SECRET_ACCESS_KEY

assume_call=$(aws sts assume-role --role-arn $CICD_ROLE_ARN --role-session-name AWSCLI-Session)

# {
#    "Credentials": {
#        "AccessKeyId": "<>",
#        "SecretAccessKey": "<>",
#        "SessionToken": "<>",
#        "Expiration": "2020-08-01T19:46:08Z"
#    },
#    "AssumedRoleUser": {
#        "AssumedRoleId": "xyzabc:AWSCLI-Session",
#        "Arn": "arn:aws:sts::account-id:assumed-role/iam-user-name/AWSCLI-Session"
#    }
#}

# JQ playground - https://jqplay.org

assumed_aws_access_key=$(echo $assume_call | jq -r .Credentials.AccessKeyId) 
assumed_aws_access_secret_key=$(echo $assume_call | jq -r .Credentials.SecretAccessKey)
assumed_aws_session_token=$(echo $assume_call | jq -r .Credentials.SessionToken)

export AWS_ACCESS_KEY_ID=$assumed_aws_access_key
export AWS_SECRET_ACCESS_KEY=$assumed_aws_access_secret_key
export AWS_SESSION_TOKEN=$assumed_aws_session_token

(cd $deploy_path && sls deploy --stage $stage --region $region -v)