#! /bin/bash

echo "*** Setting variables from .env file ***"
set -a
[ -f .env ] && . .env
set +a

echo "*** Install eksctl ***"
bash ./scripts/install-eksctl.bash

aws_access_key_id=$(sls output get --name EKSUserAccessKeyId --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-iam-user)
aws_secret_access_key=$(sls output get --name EKSUserSecretKey --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-iam-user)

export AWS_ACCESS_KEY_ID=$aws_access_key_id
export AWS_SECRET_ACCESS_KEY=$aws_secret_access_key

# Create the dist folder for built kubernetes YAML files
mkdir -p ./resources/dist/

# Build fargate-cluster.yml
sed s%'${env:custom_namespace}'%$custom_namespace%g ./resources/fargate-cluster.yml > ./resources/dist/fargate-cluster.yml
sed -i "" s%'${env:region}'%$region%g ./resources/dist/fargate-cluster.yml

echo "*** Create Fargate cluster ***"
# https://github.com/weaveworks/eksctl/tree/master/examples
eksctl create cluster -f ./resources/dist/fargate-cluster.yml

echo "*** Enable CloudWatch logging ***"
eksctl utils update-cluster-logging --region=$region --cluster=$cluster_name --enable-types all --approve