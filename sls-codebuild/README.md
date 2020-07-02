# Serverless Framework CodeBuild Example

* [Core Files](#core-files)
* [CI/CD Flow](#ci/cd-flow)
    * [Environment Variables](#environment-variables)
    * [Install](#install)
    * [Build](#build)
* [Code Pipeline](./resources/codepipeline/README.md)

## Core files

* `index.js` -> AWS Lambda function

* `serverless.yml` -> creates our simple REST API + Lambda function

* `package.json` -> our npm dependencies and our scripts for `npm run test` which triggers Jest

* `resources/` -> has our AWS Codebuild IAC

* `__tests__` -> Jest tests for demo purposes

## CI/CD flow

Below you can see our `buildspec.yml` file this is what AWS CodeBuild will use to deploy our Serverless Framework project.

```yaml
version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 10
    commands:
      - npm install serverless -g
      - serverless -v
      - cd sls-codebuild    # <-- this would be relevant to your code structure
      - npm install
  build:
    commands:
      - npm run jest
      - if [[ $? == 1 ]]; then exit; fi
      - echo "SUCCESSFULLY PASSED TESTS!"
      - export SERVERLESS_ACCESS_KEY=${SERVERLESS_ACCESS_KEY}
      - sls deploy --stage ${STAGE} --region ${REGION} -v
  post_build:
    commands:
      - echo "POST_BUILD STEP"
```

### Environment Variables

Are being fed into our `buildspec.yml` from our [resources/codepipeline/serverless.yml](./resources/codepipeline/serverless.yml).

### Install

Below you can see that we are telling AWS CodeBuild that during the `install` phase use the runtime version of `NodeJS 10` and use the follow list of commands (e.g. `npm install serverless -g`). The final command will install our npm dependencies.

```yaml
phases:
  install:
    runtime-versions:
      nodejs: 10
    commands:
      - npm install serverless -g
      - serverless -v
      - cd sls-codebuild    # <-- may not be needed for you, this would be relevant to your code structure
      - npm install
```

### Build

During the `build` step we are running `jest` tests and also validating if the jest tests passed or not. If these tests did pass we will set our `SERVERLESS_ACCESS_KEY` which allows AWS CodeBuild to communicate with our Serverless Framework Pro organization. Finally, we make a deployment of our app using `${STAGE}` and `${REGION}` which are passed in through the environment variables.

```yaml
phases:
    build:
        commands:
        - npm run jest
        - if [[ $? == 1 ]]; then exit; fi
        - echo "SUCCESSFULLY PASSED TESTS!"
        - export SERVERLESS_ACCESS_KEY=${SERVERLESS_ACCESS_KEY}
        - sls deploy --stage ${STAGE} --region ${REGION} -v
```