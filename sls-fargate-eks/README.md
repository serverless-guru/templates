# Serverless Fargate / EKS pattern

## High Level

* [infrastructure](./infrastructure/README.md) - defines the shared infrastructure used to create our AWS EKS / Fargate resources

* [app](./app/README.md) - defines our ExpressJS application which will deployed to our Fargate / EKS cluster

## Deployment Order

1. [Deploy Shared Infrastructure](#deploy-shared-infrastructure)

2. [Deploy App](#deploy-app)

### Deploy Shared Infrastructure

#### Deploy ECR

This will create an AWS Elastic Container Repository where we will store our docker images.

Note: Change the `org` and `app`, but be consistent with the `app` name.

```console
cd infrastructure/ecr

sls deploy --stage dev --region us-east-1 -v
```

#### Deploy AWS IAM User for eksctl

This user has permission to work with the `eksctl`, but not `admin` permissions.

Note: Change the `org` and `app`, but be consistent with the `app` name.

Change directories

```console
cd infrastructure/iam-user
```

Deploy

```console
sls deploy --stage dev --region us-east-1 -v
```

#### Deploy EKS Cluster, VPC, Fargate Profiles, and enable cluster logging

Change directories

```console
cd infrastructure/eks
```

Create the `.env` file

```
cat <<EOF >./.env
region=us-east-1
sls_pro_org=serverlessguru
sls_pro_app=sls-fargate-eks
stage=dev
cluster_name=fargate-cluster
custom_namespace=express-api
EOF
```

Deploy the EKS Cluster, VPC, Fargate Profiles, and enable cluster logging

```console
bash ./scripts/deploy.bash
```

### Deploy App

This will install `eksctl`, `kubectl`, build dynamic kubectl YAML files based on `.env` values, and apply the kubectl YAML files.

Change directories

```console
cd app/
```

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