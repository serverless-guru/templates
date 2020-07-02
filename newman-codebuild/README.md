# Newman with Codebuild

&nbsp;

This is a template for adding Newman to a test project and automatically testing on build. The goal is for SLS Offline to provision a local server for Newman API tests before deployment: if any tests fail the build is stopped to prevent failed code from being published. 

&nbsp;

1. [Write Postman Tests](#Write-Postman-Tests)
2. [Create Newman Tests](#Create-Newman-Tests)
3. [Create Buildspec File](#Create-Buildspec-File)
4. [Deploy](#Deploy)

## Writing Postman Tests

### Test Scripts & Assertions

Tests occur after an API request is finished and typically analyze or use data from the response.

For example let's say we have a test named "Status Test" that checks if the response status is 200. This is written as:

```
pm.test("Status Test", function () {
    pm.response.to.have.status(200);
});
```

Assertions are run in a similar format:

```
"pm.test('expect response json contain args', function () {",
"    pm.expect(pm.response.json().args).to.have.property('source')",
"      .and.equal('newman-sample-github-collection')",
"})"
```

Finally you can find more example tests below or read further with [this tutorial](https://learning.getpostman.com/docs/postman/scripts/test-scripts/):

```
pm.test("response should be okay to process", function () {
    pm.response.to.not.be.error;
    pm.response.to.have.jsonBody("");
    pm.response.to.not.have.jsonBody("error");
});
```

### Pre-request Scripts

Pre-request scripts run _before_ an API call is made and are generally used for setting up environmental variables & headers. An example would be setting a dynamic date for your header:

```
pm.environment.set("currentTimeHeader", new Date());
```

Another would be resetting a variable to ensure it's consistent:

```
pm.environment.set("username", "Erin Korth");
```

Tests and pre-request scripts can be found within each API in the Postman console:

![postman terminal](./test-console.png)

## Create Newman Tests

Newman allows Postman APIs and test libraries to be run via command line and even JavaScript. In our use case this means we can run Postman APIs during build scripts to evaluate whether any code changes caused errors.

### Write Newman Commands

Newman tests can be run locally by name:
```
$ newman run filepath/collection-name.json
```

Or run via URL:
```
$ newman run https://www.getpostman.com/collections/cb208e7e64056f5294e5
```

With [Serverless Offline](https://github.com/dherault/serverless-offline) you can test APIs using a local server.

You can run a local server in one tab while testing in another:
```
# Window 1:
$ serverless offline & 

# Window 2:
$ newman run filepath/collection-name.json
$ newman run https://www.getpostman.com/collections/093607256e1a6b4c0deb
...
```

Serverless Offline also includes a `start --exec` command that indicates a server is being used strictly for testing. This will create a local server strictly for testing that automatically stops once all passed scripts are finished:
```
$ sls offline start --exec "newman run https://www.getpostman.com/collections/093607256e1a6b4c0deb & newman run test.postman_collection.json"
```

Passing each test set individually allows you to evaluate all test results. The following example bash script runs two test sets before deploying and will halt the deployment if any errors return:

`example.bash`
```
sls offline start --exec "newman run test.postman_collection.json"

if [ $? == 1 ]; then exit; fi

sls offline start --exec "https://www.getpostman.com/collections/093607256e1a6b4c0deb"

if [ $? == 1 ]; then exit; fi

echo "SUCCESSFULLY PASSED TESTS!"

sls deploy
```


### Export Postman Tests

To create local test files for the aforementioned tests:

1. Enter Postman and navigate to "Collections"
2. Hover on the desired collection and select the "View More Actions" ellipsis icon
3. Select "Export" and export as the newest collection type (currently v2.1).
4. Save file in your local test folder

![Newman Export](./newman-export.gif)

## Create Buildspec File

To run your Newman tests during deployment add them to your `buildspec.yml` file. If you want to prevent deployment when tests fail make sure to put test commands _before_ your deployment.

The example `buildspec.yml` file will:

1. Install Serverless, Newman, and any supporting npm files.
2. Check versions to ensure installments worked
3. Run Newman test(s) and exit script if any errors are detected.
4. Deploy `serverless.yml` file.

```
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 10
    commands:
      - npm install serverless -g
      - npm install newman -g
      - cd newman-codebuild
      - npm install
      - serverless -v
      - newman -v
  build:
    commands:
      - sls offline start --exec "newman run test.postman_collection.json"
      - if [ $? == 1 ]; then exit; fi
      - echo "SUCCESSFULLY PASSED TESTS!"
      - sls deploy
  post_build:
    commands:
      - ...
```

## Deploy

You can deploy your project using CodeBuild in the AWS console using the following:

1. Create new CodeBuild project. Add your source provider (GitHub, Bitbucket, etc.), create or add an AWS service role to your build, and enter logs/environment variables/etc. as needed in the creation screen.
2. Select "Start Build" from the project's hub in Code Build.
3. Add timeout and environmental variable features as needed then press "Start Build"

A live log of the CodeBuild will then be available in the next screen. Your test results and any build errors will then be readable there.