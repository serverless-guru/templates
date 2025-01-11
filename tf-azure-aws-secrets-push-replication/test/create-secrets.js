const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const keyVaultName = "your-keyvault-name";
const url = `https://${keyVaultName}.vault.azure.net`;
const client = new SecretClient(url, new DefaultAzureCredential());

const createSecrets = async () => {
  for (let i = 1; i <= 5; i++) {
    const secretName = `test-secret-${i}`;
    const secretValue = `random-value-${Math.random().toString(36).substring(2)}`;
    await client.setSecret(secretName, secretValue);
    console.log(`Created secret: ${secretName}`);
  }
};

createSecrets().catch(console.error);
