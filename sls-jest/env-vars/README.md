# Serverless Framework + Jest

## Purpose

This is a walk through of how to use Serverless Framework Pro params with AWS Lambda environment variables utilizing a plugin called [serverless-export-env](https://github.com/arabold/serverless-export-env) with Jest testing.

## Setup

* Install - `npm i`

## How to handle environment variables defined in our serverless.yml with Jest?

If you want to automatically pull in your `serverless.yml` environment variables and use those for your Jest unit testing, then you're going to need a few things.

1. [Serverless Framework Pro Org + App + Profile](#Serverless-Framework-Pro-Org-+-App-+-Profile)

2. [Deploy your stack](#deploy-your-stack)

3. [Serverless Export Env plugin](#Serverless-Export-Env-plugin)

4. [Test](#test)

### Serverless Framework Pro Org + App + Profile

* Create an Org

* Create an App called, `sls-jest`

* Create a Profile called, `dev`

* [Configure AWS IAM Role deployments](https://serverless.com/framework/docs/dashboard/access-roles/#access-roles)

* Create a `dev` profile param called, `COUNT_CHARS_API_KEY` with a value of `xyz`

### Deploy your stack

This is only required to setup the connection to Serverless Framework Pro.

* Deploy - `sls deploy --stage dev --region us-west-2 -v`

### Serverless Export Env plugin

* Install - `npm install --save-dev arabold/serverless-export-env`

* Generate the `.env` file - `sls export-env`

### Test

Now that we have the `.env` file ready. We need too..

1. Install dotenv - `npm i --save-dev dotenv`

2. [Create a file at `jest/setEnvVars.js`](#Create-a-file-at-jest/setEnvVars.js)

3. [Create a Jest test at `src/handlers/_tests/index.test.js`](#Create-a-jest-test-at-src/handlers/_tests/index.test.js)

4. [Run Jest](#run-jest)

#### Create a file at jest/setEnvVars.js

We only need a single line here.

```js
require("dotenv").config()
```

#### Create a Jest test at src/handlers/_tests/index.test.js

We only need to import the `index.js` file, call `index.handler({})`, 
then check if the `body.message` equals `API_KEY-${process.env.API_KEY}` 
which in our case should be `API_KEY-xyz`.

```js
const index = require('../index');

test('check string matches with env var', async () => {
    const result = await index.handler({});
    let body = JSON.parse(result.body);
    // we set the environment variable as xyz and are checking
    // to see if that comes back correctly
    expect(body.message).toBe('API_KEY-xyz');
});
```

#### Run Jest

Now that we have everything setup we can run `npm run jest`.