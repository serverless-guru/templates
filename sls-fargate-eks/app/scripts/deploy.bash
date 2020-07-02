#! /bin/bash

echo "*** Setting variables from .env file ***"
set -a
[ -f .env ] && . .env
set +a

echo "*** Install eksctl ***"
bash ./scripts/install-eksctl.bash

echo "*** Install kubectl ***"
bash ./scripts/install-kubectl.bash

echo "*** Set path to kubectl and eksctl ***"
export PATH=$PATH:$HOME/bin

echo "*** Building kubectl YAML files for deployment ***"
bash ./scripts/build-files.bash

aws_access_key_id=$(sls output get --name EKSUserAccessKeyId --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-iam-user)
aws_secret_access_key=$(sls output get --name EKSUserSecretKey --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-iam-user)

export AWS_ACCESS_KEY_ID=$aws_access_key_id
export AWS_SECRET_ACCESS_KEY=$aws_secret_access_key

echo "*** Adding new context to /home/user/.kube/config ***"
aws eks update-kubeconfig --name $cluster_name --region $region

echo "*** Creating RBAC role ***"
kubectl apply -f ./resources/dist/rbac-role.yml

echo "*** Creating ALB ***"
kubectl apply -f ./resources/dist/alb-ingress-controller.yml

echo "*** Deploy docker image ***"
bash ./scripts/deploy-ecr.bash

echo "*** Create namespace ***"
kubectl apply -f ./resources/dist/namespace.yml

echo "*** Create service ***"
kubectl apply -f ./resources/dist/service.yml

echo "*** Create deployment ***"
kubectl apply -f ./resources/dist/deployment.yml

echo "*** Create ingress ***"
kubectl apply -f ./resources/dist/ingress.yml

