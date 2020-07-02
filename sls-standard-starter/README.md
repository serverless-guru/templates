# Tutorial for Setting up and Deploying a Serverless Project

* [Overview](#Overview)

* [Breakdown](#File-Breakdown)

* [Deploy](#deploy)

## Overview

This tutorial explains how to create a project using the Serverless Framework and then deploy its resources to AWS. Our example sets up a template API Gateway before adding an additional endpoint.

A full list of Serverless-specific properties for AWS can be found at the [Serverless.yml Reference](https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/). 

General Serverless documentation can be found [here](https://serverless.com/framework/docs/). 

Serverless Framework builds on CloudFormation. To learn more read the [CloudFormation docs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html).

## File Breakdown

This section explains all the elements of our current working directory.

### Top level files/directories

```
$ ls
resources/ services/ lib/ ...
```

* `resources/` - contains all major resources components like databases, userpools, APIs, and so forth. Each has its own folder and deployment config. In this example we have `resources/api/`.
* `services/` - contains all API endpoints that are managed individually. In this example we have a single service, `services/countCharacters`.
* `lib/` contains resources files shared among multiple services and/or resources. None exist for this project but examples would include function libraries and hard-coded resource lists.


### Resource Folder

Our example has the following primary files:

```
$ ls resources/api/
.serverless/ serverless.yml index.js ...
```

* `serverless.yml` - the core build file required for Serverless functionality.
* `index.js` - a handler file written for our dummy API function. THis is specific to our API service.
* `.serverless/` - a Serverless resource folder that auto-populates on build. Ours is on `.gitignore` and not committed

Everything else at this level relates to general npm/git functions:
* `package.json`
* `package-lock.json`


#### resources/api/serverless.yml

```
org: serverlessguru
app: serverless-app

service: serverless-app-api

provider:
  name: aws
  runtime: nodejs12.x
  stage: ${opt:stage, "dev"}
  region: ${opt:region, "us-west-2"}
  profile: ${opt:profile, "default"}

plugins:
  - serverless-offline

package:
  exclude:
    - ./**
  include:
    - index.js

custom:
  base: ${self:service}-${self:provider.stage}

functions:
  test:
    name: ${self:custom.base}-test
    handler: index.handler
    description: Returns "Hello World". Dummy function for API deployment
    events:
      - http:
          path: /test
          method: any
          cors:
            origin: '*'
            headers:
              - Content-Type
              - X-Amz-Date
              - Authorization
              - X-Api-Key
              - X-Amz-Security-Token
              - X-Amz-User-Agent
              - version
              - x-uuid
outputs:
  ApiEndpoint:
    Fn::Join:
      - ''
      - - https://
        - Ref: ApiGatewayRestApi
        - .execute-api.${self:provider.region}.amazonaws.com/${self:provider.stage}
  ApiId:
    Ref: ApiGatewayRestApi
  ApiResourceId:
    Fn::GetAtt:
    - ApiGatewayRestApi
    - RootResourceId 
```
The yml file can be broken down into the following chunks:

* `org` & `app` - when using the Serverless Framework Pro include your organization and app names at the top of the document. This will connect your project to the dashboard. (**Serverless Framework Pro only**)
* `service` - the name of the resource being deployed.
* `provider` - Lists various project attributes. For more detail on variables look [here](https://github.com/serverless-guru/docs/blob/master/serverless-framework/serverless-syntax.md).
* `plugins` - an optional section for including plugins. In this case we're import serverless-offline which is helpful for local API testing.
* `package` - a manual list of files to include and exclude on build. By default Serverless will use every file found at the root directory which is both resource-intensive and insecure. A solid method is to exclude all resources by default and then call out the files & folders you want to use individually. This process is especially important for importing `lib/` files.
* `custom` - local variables can be defined here. In this case we created a "base" variable that can be used for consistent naming across the document by referencing `${self:custom.base}`
* `functions` - a list of Lambda functions. The important note here is that we're actually using this section to implicitly create a reusable API Gateway endpoint. The details under the `test` header are all for our newly defined test endpoint - you can edit the name and function as you please.
* `outputs` - creates three output variables `ApiEndpoint`, `ApiId`, and `ApiResourceId` once deployment is finished. These will then be available to future projects through the Serverless Framework Pro. (**Serverless Framework Pro only**)

#### resources/api/index.js

```
module.exports.handler = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify({'message': "hello world"})
  }
};
```

We are exporting a handler for use in our `test` function in `serverless.yml`. This is a basic example that simply returns a static statusCode and body whenever the endpoint is invoked.

#### resources/api/.serverless

This folder is auto-generated by Serverless Framework on build. This entire folder is listed on our `.gitignore` because it contains sensitive CloudFormation Templates and resource zip files for final deployment. These files can be very helpful for debugging - if anything here looks incorrect you know that your `serverless.yml` isn't configured correctly.

### Service Folder

Our example has the following primary files:

```
$ ls services/countCharacters/
.serverless/ handlers/ serverless.yml ...
```

* `serverless.yml`
* `handlers/` - a folder for API handlers. In this instance we only have only endpoint, `handlers/index.js` for our lone POST function
* `.serverless/`
* `.gitignore`

#### services/countCharacters/serverless.yml

```
org: serverlessguru
app: serverless-app

service:
  name: serverless-app-count-characters

package:
  exclude:
    - src/**
    - .gitignore
  include:
    - src/handlers/**
    - node_modules/**

provider:
  name: aws
  runtime: nodejs12.x
  stage: ${opt:stage, "dev"}
  region: ${opt:region, "us-west-2"}
  profile: ${opt:profile, "default"}
  apiGateway:
    restApiId: ${output:${self:app}-api.ApiId}
    restApiRootResourceId: ${output:${self:app}-api.ApiResourceId}

custom:
  base: ${self:service}-${self:provider.stage}

functions:
  api:
    name: ${self:custom.base}
    handler: ./handlers/index.handler
    description: Returns the length of a given message
    events:
      - http:
          path: /countCharacters
          method: POST
          cors: true
```

The individual sections are near identical to the one above as they are both creating Lambda functions with API Gateway endpoints. It's worth comparing the differences between the `test` and `api` functions. The two important features here are: 
* Our previous deployed API resource is being reused by referencing it in the `Provider: apiGateway:` section. 
* variables are being pulled using `${output:}` which reference the outputs created in our `resources/api` yml.  (**Serverless Framework Pro only**). For more on outputs read [here](https://github.com/serverless-guru/docs/blob/master/serverless-framework/serverless-syntax.md).

For more template examples with other resources read [here](https://github.com/serverless-guru/templates).

#### services/countCharacters/handlers/index.js

A folder that can contain multiple API handlers. In this instance we just have the one:

```
module.exports.handler = async event => {

  const content = JSON.parse(event.body);
  const length = content.message.length;

  return {
    statusCode: 200,
    body: JSON.stringify({'response': `Your message is ${length} characters long`})
  }
};
```

Just as with the former example we have an exported handler with a return block. This one uses a small amount of editing based on an expected user input of "message". Additional NodeJS code can be added for more complex functionality.

## Deploy

This general flow works for most compartmentalized Serverless projects:

### 1. Install Serverless

```
$ npm install -g serverless
```

### 2. Navigate to Directory
```
$ cd resources/api
```

### 3. Install Dependencies (As Needed)
```
$ npm install
```

### 4. Deploy
```
$ sls deploy
```

### 5. Repeat for Other YMLs
```
$ cd ../../services/countCharacters
$ npm install
$ sls deploy
...
```

### Additional Considerations

#### Deployment Order and Resource Coupling

When deploying it's important to bear two things in mind:
* What order do your deploys need to be executed in?
* What locations do these deploys need to be executed from?

In this example we ran `resources/api` before `services/countCharacters` because the service deployment will **fail** if run first - it's written to pull outputs from an existing deployment. This tight coupling is only important on the initial deployment and any future updates to new outputs. Beyond that you are free and encouraged to manage them separately.

#### Scripting Deployments

Keeping a scripts folder is a good way to both keep track of deployment order and not worry about deploying from the incorrect folder - set it and forget it! An example script run from the root `templates/sls-standard-starter` directory would look like:

`example.bash`
```
stage="dev"
region="us-west-2"
profile="default"

npm install -g serverless

echo "Deploying API"
cd resources/api
npm install
sls deploy --stage $stage --region $region --profile $profile -v
cd ../../

echo "Deploying Count Characters Service"
cd services/countCharacters
sls deploy --stage $stage --region $region --profile $profile -v
cd ../../
```

This would be a "Deploy all" type script for initial deployments. For future deploys it's more efficient to just deploy the resources you need.

#### Monorepo vs. Separated Structure

It's worth noting that these files could have been structured as a monorepo with a single root-level `serverless.yml`. Project setup and resource sharing is generally easier this way and it can be great for testing connections or building small projects. That said we generally encourage a separated structure like the example for a number of reasons:
* Individual **deployments are faster** since the entire app isn't being reevaluated on each change
* **Project security** is easier when repo access can be managed granularly - a monorepo means frontend, backend, and data all share the same deployment & resources
* Servers, databases, and other **core services are safer** since their resources are maintained separately
* **Fewer deployment conflicts** arise when each team/dev/resource has its own deployment - what happens if the frontend and backend deploy changes at the same time?
