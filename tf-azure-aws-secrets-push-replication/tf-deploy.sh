# !/bin/bash
export ARM_SUBSCRIPTION_ID=$(az account show --query id -o tsv)
export ARM_CLIENT_ID=$(az ad signed-in-user show --query id -o tsv)
export ARM_TENANT_ID=$(az account show --query tenantId -o tsv)
terraform init
terraform validate
terraform plan -out=my.tfplan 
terraform apply my.tfplan
terraform apply -replace="null_resource.deploy_function_cli"



