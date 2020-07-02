#! /bin/bash

echo "*** Setting variables from .env file ***"
set -a
[ -f .env ] && . .env
set +a

aws_access_key_id=$(sls output get --name EKSUserAccessKeyId --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-iam-user)
aws_secret_access_key=$(sls output get --name EKSUserSecretKey --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-iam-user)

export AWS_ACCESS_KEY_ID=$aws_access_key_id
export AWS_SECRET_ACCESS_KEY=$aws_secret_access_key

echo "*** Install eksctl ***"
bash ./scripts/install-eksctl.bash

eksctl delete cluster --region=$region --name=$cluster_name
