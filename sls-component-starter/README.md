# Sample Component Template

This component is simply a template to get started. It will create a s3 bucket and remove an s3 bucket.

&nbsp;

- [0. Tutorial](#tutorial)
- [1. Install](#1-install)
- [2. Create](#2-create)
- [3. Configure](#3-configure)
- [4. Deploy](#4-deploy)
- [New to Components?](#new-to-components)

&nbsp;


### 0. Tutorial

If you're looking to learn how to build serverless components take a look at this [Walk through tutorial](./tutorial.md).


### 1. Install

```console
$ npm install -g serverless
```

### 2. Create

Just create a `serverless.yml` file

```shell
$ touch serverless.yml
$ touch .env
```

the `.env` files should look like this.

```
AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=XXX
```

### 3. Configure

```yml
# serverless.yml

component: sample-component  # The name of the Component in the Registry
org: example-org             # Your Serverless Framework Org
app: example-app             # Your Serverless Framework App
name: sample-component-sg    # The name of your instance of this Component
stage: dev
inputs:
  bucket: ${app}-${name}-${stage}  # dynamic naming
```

Inputs can contain the following properties:

- `bucket` **[required]**. the name of the bucket

### 4. Deploy

```console
$ sls deploy --debug
```

### New to Components?

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
