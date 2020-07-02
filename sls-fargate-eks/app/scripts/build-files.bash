#! /bin/bash

echo "*** Setting variables from .env file ***"
set -a
[ -f .env ] && . .env
set +a

aws_access_key_id=$(sls output get --name EKSUserAccessKeyId --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-iam-user)
aws_secret_access_key=$(sls output get --name EKSUserSecretKey --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-iam-user)

export AWS_ACCESS_KEY_ID=$aws_access_key_id
export AWS_SECRET_ACCESS_KEY=$aws_secret_access_key

# Create the dist folder for built kubernetes YAML files
mkdir -p ./resources/dist/

# get vpc_id
vpc_id=$(aws ec2 describe-vpcs --filters Name=tag:alpha.eksctl.io/cluster-name,Values=$cluster_name --region $region --query 'Vpcs[0].VpcId')

# Outputs from IAC stacks
ecr_repo_uri=$(sls output get --name ECRUri --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-ecr)
aws_access_key_id=$(sls output get --name EKSUserAccessKeyId --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-iam-user)
aws_secret_access_key=$(sls output get --name EKSUserSecretKey --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-iam-user)

# deployment
sed s%'${env:ecr_repo_uri}'%$ecr_repo_uri:latest%g ./resources/deployment.yml > ./resources/dist/deployment.yml
sed -i '' s%'${env:custom_namespace}'%$custom_namespace%g ./resources/dist/deployment.yml

# alb-ingress
sed s%'${env:cluster_name}'%$cluster_name%g ./resources/alb-ingress-controller.yml > ./resources/dist/alb-ingress-controller.yml
sed -i '' s%'${env:region}'%$region%g ./resources/dist/alb-ingress-controller.yml
sed -i '' s%'${env:AWS_ACCESS_KEY_ID}'%$aws_access_key_id%g ./resources/dist/alb-ingress-controller.yml
sed -i '' s%'${env:AWS_SECRET_ACCESS_KEY}'%$aws_secret_access_key%g ./resources/dist/alb-ingress-controller.yml
sed -i '' s%'${env:vpc_id}'%$vpc_id%g ./resources/dist/alb-ingress-controller.yml

# rbac role
cp ./resources/rbac-role.yml ./resources/dist/rbac-role.yml

# app-ingress
sed s/'${env:custom_namespace}'/$custom_namespace/g ./resources/ingress.yml > ./resources/dist/ingress.yml

# service
sed s/'${env:custom_namespace}'/$custom_namespace/g ./resources/service.yml > ./resources/dist/service.yml

# namespace
sed s/'${env:custom_namespace}'/$custom_namespace/g ./resources/namespace.yml > ./resources/dist/namespace.yml


