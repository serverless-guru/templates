terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.82.2"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.14.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

provider "azurerm" {
  features {}
}

module "aws_resources" {
  source = "./aws"
}

module "azure_resources" {
  source                  = "./azure"
  azure_function_role_arn = module.aws_resources.azure_function_role_arn
  aws_region              = module.aws_resources.aws_region
  aws_api_id              = module.aws_resources.aws_api_id
}