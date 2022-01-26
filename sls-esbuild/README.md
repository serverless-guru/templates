# Serverless EsBuild - Example Project

## Purpose

Fast lambda packaging and build.

## Steps

### Install

```bash
npm i --save-dev serverless-esbuild esbuild

```

### Update serverless.yml file in plugins section

```yaml
provider:
    name: aws
    ...
plugins:
    - serverless-esbuild
```

### Review pipeline deployment time, it should be less

### Additional Optimization, add package: individually: true

```yaml
provider:
    name: aws
    ...
package:
    individually: true
plugins:
    - serverless-esbuild
```
