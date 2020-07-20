# Serverless Prune Plugin

## Purpose

Get past the `Code Storage limit exceeded` error thrown by AWS. This happens as you make Serverless Framework deployments, each deployment will create a new version of your function and lead to a problem downstream.

## Documentation

https://www.npmjs.com/package/serverless-prune-plugin

## Commands

### Manual Prune

```bash
sls prune -n 1
```

### Automatic Prune

```yaml
custom:
    prune:
        automatic: true
        number: 1
```

Then when you run `sls deploy` it will automatically prune versions for you.
