#! /bin/bash

# echo "*** Setting variables from .env file ***"
set -a
[ -f .env ] && . .env
set +a

ecr_name=$(sls output get --name ECRName --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-ecr)
ecr_arn=$(sls output get --name ECRArn --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-ecr)
ecr_repo_uri=$(sls output get --name ECRUri --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-ecr)

echo "*** Building Docker Image ***"
docker build --file ./Dockerfile -t $ecr_name .

echo "*** Logging in ***"
eval $(aws ecr get-login --no-include-email --region $region)

echo "*** Setting image_id and ECR repository_uri ***"
image_id=$(docker images -q $ecr_name)

echo "*** Tagging image of $image_id ***"
docker tag $image_id $ecr_repo_uri

echo "*** Pushing to $ecr_repo_uri to ECR ***"
docker push $ecr_repo_uri