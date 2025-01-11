data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "rg" {
  name     = "secrets-azure-aws"
  location = "westus2"
}

resource "azurerm_key_vault" "kv" {
  name                = "secrets-azure-aws-kv"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku_name            = "standard"
  tenant_id           = data.azurerm_client_config.current.tenant_id

  tags = {
    Environment = "Development"
    Purpose     = "Demo"
    Article     = "Cross-Cloud Secrets Replication, Sharing, and Best Practices"
  }
}

resource "azurerm_key_vault_access_policy" "azure_function_kv_access" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id = azurerm_linux_function_app.secrets_azure_aws_function_app.identity[0].principal_id
  secret_permissions = [
    "Get",
    "List",
  ]
  key_permissions = [
    "Get",
    "List",
  ]    
}

resource "azurerm_key_vault_access_policy" "system_topic_kv_access" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id = azurerm_eventgrid_system_topic.secret_update_topic.identity[0].principal_id
  secret_permissions = [
    "Get",
    "List",
  ]
  key_permissions = [
    "Get",
    "List",
  ]    
}

resource "azurerm_key_vault_access_policy" "principal_kv_access" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id = data.azurerm_client_config.current.object_id

  secret_permissions = [
    "Get",
    "List",
    "Set",
    "Delete",
    "Backup",
    "Restore",
    "Recover",
    "Purge",
  ]

  key_permissions = [
    "Get",
    "List",
    "Create",
    "Import",
    "Delete",
    "Backup",
    "Restore",
    "Recover",
    "Purge",
  ]
  
}


resource "azurerm_eventgrid_system_topic" "secret_update_topic" {
  name                   = "secrets-azure-aws-topic"
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  topic_type             = "Microsoft.KeyVault.vaults"
  source_arm_resource_id = azurerm_key_vault.kv.id
  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = "Development"
    Purpose     = "Demo"
    Article     = "Cross-Cloud Secrets Replication, Sharing, and Best Practices"
  }
}

resource "azurerm_storage_account" "sa" {
  name                     = "secretsazureaws"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    Environment = "Development"
    Purpose     = "Demo"
    Article     = "Cross-Cloud Secrets Replication, Sharing, and Best Practices"
  }
}
resource "azurerm_service_plan" "asp" {
  name                = "secrets-azure-aws-asp"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "Y1"

  tags = {
    Environment = "Development"
    Purpose     = "Demo"
    Article     = "Cross-Cloud Secrets Replication, Sharing, and Best Practices"
  }
}
resource "azurerm_storage_container" "secrets_azure_aws_function_container_code" {
  name                  = "set-aws-secret-function"
  storage_account_id    = azurerm_storage_account.sa.id
  container_access_type = "private"
}

resource "archive_file" "secrets_azure_aws_function_archive" {
  type             = "zip"
  source_dir      = "${path.module}/set-aws-secret-function"
  output_file_mode = "0666"
  output_path      = "${path.module}/set-aws-secret-function.zip"
}

resource "azurerm_storage_blob" "secrets_azure_aws_function_zip" {
  name                   = "set-aws-secret-function.zip"
  storage_account_name   = azurerm_storage_account.sa.name
  storage_container_name = azurerm_storage_container.secrets_azure_aws_function_container_code.name
  type                   = "Block"
  source                 = "${path.module}/set-aws-secret-function.zip"
  depends_on = [archive_file.secrets_azure_aws_function_archive]

}

data "azurerm_storage_account_blob_container_sas" "sas_token" {
  connection_string = azurerm_storage_account.sa.primary_connection_string
  container_name    = azurerm_storage_container.secrets_azure_aws_function_container_code.name
  https_only        = true

  start  = timestamp()
  expiry = timeadd(timestamp(), "24h")
  permissions {
    read   = true
    add    = true
    create = false
    write  = false
    delete = false
    list   = true
  }
}

resource "azurerm_application_insights" "secrets_azure_aws_function_app_insights" {
  name                = "functions-app-insights"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "Node.JS"

  tags = {
    Environment = "Development"
    Purpose     = "Demo"
    Article     = "Cross-Cloud Secrets Replication, Sharing, and Best Practices"
  }
}

resource "azurerm_linux_function_app" "secrets_azure_aws_function_app" {
  name                       = "functions-app-azure"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  service_plan_id            = azurerm_service_plan.asp.id
  storage_account_name       = azurerm_storage_account.sa.name
  storage_account_access_key = azurerm_storage_account.sa.primary_access_key

  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME" = "node"
    "WEBSITE_RUN_FROM_PACKAGE" = "https://${azurerm_storage_account.sa.name}.blob.core.windows.net/${azurerm_storage_container.secrets_azure_aws_function_container_code.name}/${azurerm_storage_blob.secrets_azure_aws_function_zip.name}?${data.azurerm_storage_account_blob_container_sas.sas_token.sas}"
    "AzureWebJobsStorage"      = azurerm_storage_account.sa.primary_connection_string
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.secrets_azure_aws_function_app_insights.connection_string
    "AWS_ROLE_ARN"             = var.azure_function_role_arn
    "AWS_REGION"               = var.aws_region
    "AWS_API_ID"               = var.aws_api_id
  }

  site_config {
    always_on = false
    application_stack {
      node_version = 20 
    }

  }

  tags = {
    Environment = "Development"
    Purpose     = "Demo"
    Article     = "Cross-Cloud Secrets Replication, Sharing, and Best Practices"
  }

  depends_on = [azurerm_storage_blob.secrets_azure_aws_function_zip]
}
resource "azurerm_eventgrid_system_topic_event_subscription" "secret_update_subscription" {
  resource_group_name = azurerm_resource_group.rg.name
  system_topic = azurerm_eventgrid_system_topic.secret_update_topic.name
  name  = "secrets-azure-aws-topic-subscription"
  azure_function_endpoint {
    function_id = "${azurerm_linux_function_app.secrets_azure_aws_function_app.id}/functions/set-aws-secret-function"
  }

  depends_on = [
    azurerm_linux_function_app.secrets_azure_aws_function_app,
    azurerm_storage_blob.secrets_azure_aws_function_zip
  ]
  storage_blob_dead_letter_destination {
    storage_account_id          = azurerm_storage_account.sa.id
    storage_blob_container_name = azurerm_storage_container.secrets_azure_aws_function_container_code.name
  }

  retry_policy {
    max_delivery_attempts = 3
    event_time_to_live    = 5 # minutes
  }

  included_event_types = [
    "Microsoft.KeyVault.SecretNewVersionCreated",
    "Microsoft.KeyVault.SecretUpdated",
  ]

  event_delivery_schema = "EventGridSchema" 
}