# Deploy All Services/Resources

This bash script is meant to handle a large number of Serverless Framework stacks. It was made after trying to deploy a 28 service project all at once, which took a little over 30 minutes!

This script will run these individual service deployments in the background and gather the output of the deployment in this structure:

```bash
tmp/
  resources/
    api.out
    cognito.out
  services/
    billing.out
    user.out
```

These `.out` files can be opened and reviewed to see how the deployment went.

This script works for a setup where you have the following kind of structure:

```bash
services/
  billing/
    serverless.yml
  user/
    serverless.yml
resources/
  api/
    serverless.yml
  cognito/
    serverless.yml
```

The script will be passed `stage` and `region` as arguments:

```bash
npm run deployAllResources prod us-west-2
npm run deployAllServices prod us-west-2
```