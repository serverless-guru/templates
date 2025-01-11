const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

const client = new SecretClient('https://secrets-azure-aws-kv.vault.azure.net', new DefaultAzureCredential());

const createSecrets = async () => {
  const secrets = [];
  for (let i = 1; i <= 5; i++) {
    const secretName = `test-secret-${i}`;
    const secretValue = `random-value-${Math.random().toString(36).substring(2)}`;
    secrets.push(client.setSecret(secretName, secretValue));
  }
  await Promise.all(secrets);
};

createSecrets()
  .then(() => console.log('Secrets created successfully'))
  .catch(console.error);
