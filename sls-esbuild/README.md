# Serverless EsBuild - Example Project

## Purpose

Reduce the size of your lambda package sizes.

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

### Review .zip file, it should be much smaller

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
