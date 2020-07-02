# App

## More information

This will install `eksctl`, `kubectl`, build dynamic kubectl YAML files based on `.env` values, and apply the kubectl YAML files.

Create `.env` file

```console
cat <<EOF >./.env
region=us-east-1
sls_pro_org=serverlessguru
sls_pro_app=sls-fargate-eks
stage=dev
cluster_name=fargate-cluster
custom_namespace=express-api
EOF
```

Build the app, upload to ECR, build kubectl files, apply kubectl files

```console
npm run deploy
```

Configure local kubeconfig to run kubectl commands locally

```console
source .env

aws_access_key_id=$(sls output get --name EKSUserAccessKeyId --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-iam-user)
aws_secret_access_key=$(sls output get --name EKSUserSecretKey --org $sls_pro_org --app $sls_pro_app --stage $stage --service $sls_pro_app-iam-user)

export AWS_ACCESS_KEY_ID=$aws_access_key_id
export AWS_SECRET_ACCESS_KEY=$aws_secret_access_key

aws eks update-kubeconfig --name express-api --region us-east-1
```

Get pods

```console
kubectl get pods -n express-api
```