# !/bin/bash
echo "Deploying Azure Functions"
echo "Working directory: $(pwd)"
set -e
cd azure/functions 
echo "Working directory changed to: $(pwd)"
rm -rf functions.zip
npm i --production
zip -r functions.zip . -x ".git/*" ".vscode/*" "*.log" "local.settings.json"
az functionapp deployment source config-zip --resource-group "secrets-azure-aws" --name "functions-app-azure" --src "./functions.zip"
cd ../..
echo "Azure Functions deployed successfully"