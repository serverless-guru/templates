# EKS

## More information

Create the `.env` file.

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

Deploy the EKS cluster, VPC, Fargate Profiles, and enable cluster logging

```console
bash ./scripts/deploy.bash
```

## If the deploy command fails without creating the fargate profiles

Run the following command:

```console
$ eksctl create fargateprofile -f ./resources/dist/fargate-cluster.yml
```

This will look at your cluster YAML file and deploy the fargate profiles.