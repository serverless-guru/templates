output "tenant_id" {
  value = data.azurerm_client_config.current.tenant_id
}

output "subscription_id" {
  value = data.azurerm_client_config.current.subscription_id
}

output "account_id" {
  value = data.azurerm_client_config.current.object_id
}
output "sas_url_query_string" {
  value = data.azurerm_storage_account_blob_container_sas.sas_token.sas
}