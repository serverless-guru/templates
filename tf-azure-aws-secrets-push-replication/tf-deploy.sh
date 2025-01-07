# !/bin/bash
# zip -r ./azure/secrets-azure-aws-function/secrets-azure-aws-function.zip ./azure/secrets-azure-aws-function/
zip -r ./aws/update-secrets.zip ./aws/aws-lambda/

export ARM_SUBSCRIPTION_ID=$(az account show --query id -o tsv)
export ARM_CLIENT_ID=$(az ad signed-in-user show --query id -o tsv)
export ARM_TENANT_ID=$(az account show --query tenantId -o tsv)
terraform init
terraform validate
terraform plan -out=.terraform.tfplan -input=false