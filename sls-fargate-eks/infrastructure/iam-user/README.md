# IAM User for eksctl

## More information

This user has permission to work with the `eksctl`, but not `admin` permissions.

Note: Change the `org` and `app`, but be consistent with the `app` name.

```console
cd infrastructure/iam-user

sls deploy --stage dev --region us-east-1 -v
```