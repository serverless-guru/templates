import { app } from '@azure/functions';
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";
import crypto from "crypto";
import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

app.eventGrid('handler', {
  handler: async (event, context) => {
    try {
        const roleArn = process.env.AWS_ROLE_ARN;
        const region = process.env.AWS_REGION;
        const apiId = process.env.AWS_API_ID;
        const stage = "dev";
        const resourcePath = "/set-secret";
        const host = `${apiId}.execute-api.${region}.amazonaws.com`;
    
        const stsClient = new STSClient({ region });
        const assumeRoleCommand = new AssumeRoleCommand({
          RoleArn: roleArn,
          RoleSessionName: "AzureFunctionSession",
        });
        const assumedRole = await stsClient.send(assumeRoleCommand);
        const { AccessKeyId, SecretAccessKey, SessionToken } = assumedRole.Credentials;

        const { vaultName, objectName: secretName, version } = event.data;
        const keyVaultUrl = `https://${vaultName}.vault.azure.net`;
  
        const credential = new DefaultAzureCredential();
        const client = new SecretClient(keyVaultUrl, credential);
  
        const secret = await client.getSecret(secretName, { version });

    
        const request = new HttpRequest({
          method: "POST",
          hostname: host,
          path: `/${stage}${resourcePath}`,
          headers: {
            "Content-Type": "application/json",
            host: host,
          },
          body: JSON.stringify({ [secretName]: secret.value }),
        });
    
        const signer = new SignatureV4({
          credentials: {
            accessKeyId: AccessKeyId,
            secretAccessKey: SecretAccessKey,
            sessionToken: SessionToken,
          },
          service: "execute-api",
          region: region,
          sha256: crypto.createHash,
        });
    
        const signedRequest = await signer.sign(request);
    
        const response = await fetch(`https://${signedRequest.hostname}${signedRequest.path}`, {
          method: signedRequest.method,
          headers: signedRequest.headers,
          body: signedRequest.body,
        });
    
        const responseBody = await response.text();
        context.res = {
          status: response.status,
          body: responseBody,
        };
      } catch (error) {
        context.log(`Error: ${error.message}`);
        context.res = {
          status: 500,
          body: `Error: ${error.message}`,
        };
      }
  },
});