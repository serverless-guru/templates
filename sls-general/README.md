# Serverless General Pattern
## 1. Serverless.yml Conventions
### Avoid hard coding names, stage names, and arns
In the `serverless.yml` file included in this project, we want to ensure we can easily deploy to different stages without
worrying about hardcoded values. This means:

Our resources like our dynamo db table includes the stage 
 ```yml
 provider:
   environment:
      TABLE: ${self:service}-${opt:stage, self:provider.stage}

 resources:
  Resources:
      productsTable:
          Type: AWS::DynamoDB::Table
          Properties:
              TableName: ${self:service}-${opt:stage, self:provider.stage}
              AttributeDefinitions:
                  - AttributeName: PK
                    AttributeType: S
                  - AttributeName: SK
                    AttributeType: S
              KeySchema:
                  - AttributeName: PK
                    KeyType: HASH
                  - AttributeName: SK
                    KeyType: RANGE
              BillingMode: PAY_PER_REQUEST

 ```
 
Our IAM permissions are not hard coded or set as insecure wildcard permissions. We create arns with our region, account id, 
and by using the same dynamic variables we used to create our table name:
  ```yml
  iamRoleStatements:
    - Effect: Allow
      Action:
          - dynamodb:Query
          - dynamodb:GetItem
          - dynamodb:PutItem
      Resource: 'arn:aws:dynamodb:#{AWS::Region}:#{AWS::AccountId}:table/${self:service}-${opt:stage, self:provider.stage}'
  ```
  *Important Note: This example uses `serverless-pseudo-parameters` in order to accomplish the `#{}` syntax*
  
  
If our lambda function is not given a name, it will automatically be named using the service name, stage, and function name,
  which is a great convention to follow.
  
  
### Be explicit with what you package for your Lambda function
Our projects can include a lot of code that is not required when deploying to production. Tests for example are important
in the development process and to validate our code works in a CI Pipeline. They are not needed when actually deploying
our code and can add size and weight to our functions.

It is always a good idea to explicitly define what will be packaged. Example:
```yml
package:
  exclude:
    - src/**
    - .gitignore
    - .eslintrc.js
    - .eslintignore
  include:
    - node_modules/**
    - src/helpers/**
    - src/io/**
    - src/handler.js
```
In this example, we blacklist everything inside the src folder, which means we have to explicitly define what will
be included in our src folder. Start off with black listing everything, and make each inclusion a conscious decision.
  
  
  
## 2. Code Structure
### Handler Functions
Keep handler functions as small as possible. These functions should tell the high level story of what this service is doing.
All low level code should be located in functions other than the handler function. Example:

```js
const lowLevelDbFunction = async () => {
  // code that involves an sdk such as the AWS SDK...
}

const lowLevelExternalServiceCall = async () => {
  // code that involves endpoint and fetching details
}

const lowLevelBusinessLogicFunction1 => {
  // code that does not involve any io, but instead is focused on business logic
}

const lowLevelBusinessLogicFunction2 => {
  // code that does not involve any io, but instead is focused on business logic
}

exports.handler = async event => {
  const data = await lowLevelDbFunction()
  const externalData = await lowLevelExternalServiceCall()
  
  const step1Result = lowLevelBusinessLogicFunction1(data)
  const step2Result = lowLevelBusinessLogicFunction2(step1Result, externalData)
  return step2Result
}

```
Sometimes your function is so small and simple you do not need to break it up. But as soon as business logic and IO start to get
mixed together in a confusing way, you will want to split up and refactor everything into small focused functions.
Understanding how big your service will become will help you make this code structure decision sooner.

### Create a Helpers folder for reusable utility functions
When making a lambda function attached to an api gateway, it is often the case that we will be coding something like this very
often:
```js
const output = {
  statusCode: 200,
  body: JSON.stringify({
    data: 100
  })
}
```

This kind of code can get very repetitive and take up lots of space in your code. This sort of code can be abstracted, and
put into a helpers folder. Example, you could make a http helper module that looks like this:
```js
module.exports = {
    success: x => {
        return {
            statusCode: 200,
            body: JSON.stringify(x),
        }
    },

    validationError: x => {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: x
            }),
        }
    },

    serverError: x => {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: x
            }),
        }
    }
}
```
This will simplify validation, success, and error logic in our code. Our handler functions can now look something like this:
```js

exports.handler = async (event) => {
  if (!valid(event)) {
    return http.validatioError()
  }
  
  try {
    return http.success(2 + 2)
  } catch(e) {
    return http.serverError('There is a problem on our end, we are on it!')
  }
}
```

### Create an IO folder for all functionality dealing with external resources
Code that has lots of aws-sdk calls, api calls, and business logic all in one 1000 line function is very hard
to work with, and very scary to change and refactor. These functions also have lots of duplicate code.

A good strategy is to make dedicated functions for interacting with all external resources, like:
- services like stripe
- aws-sdk calls
- external api services
- internal api services

We recommend making a folder called `io` and creating functions that describe what you are doing. Example
```js
// io/index.js

module.exports = {
  db: {
    getTodos: async () => {
      // all aws-sdk language stays inside this function, our business logic doesnt need
      // to know anything about aws, it just needs a function that gets todos
    },
    saveTodo: async () => {
      // all dynamodb language stays inside this function, our business logic doesnt need
      // to know anything about dynamodb, it just needs a function that saves todos
    }
  },
  
  payments: {
    makePayment: async () => {
      // all stripe language stays inside this function, our business logic doesnt need
      // to know anything about stripe, it just needs a function to make a payment
    }
  },
  
  api: {
    getWeatherData: async () => {
      // all node-fetch language stays inside this function, our business logic doesnt need
      // to know anything about node-fetch, it just needs a function to getWeatherData
    }
  }
}
```

# 3. Code style
Code style is very contextual. Often code style needs to be defined by the team and context. What is important 
is that a team commits to a style and follows through on it. `ESLint` is a very good way to define and enforce those rules.

We recommend settng up eslint with huskey, which will insure that the linter will run before every commit on the developers
machine. We also suggest eslint to be run in a CI Pipeline as well. The reason for both?
- Run in the CI Pipeline to ensure invalid codestyle does not get merged into master. This means we are not relying on developers
to have everything properly setup on their local machine. 
- Run before commit so developers can get feedback fast. This surfaces errors in code faster, and increases speed of development.

We do suggest 2 rules be discussed by the team, defined in eslint, and enforced by a CI Pipeline:
- Maximum Function Length (example: maximum 100 lines)
- Maximum Function Indentation Depth (example: maximum 5 levels of indentation)

One practical way to achieve low indendation is to prefer using `async await` syntax over callbacks. Another is to split functionality into small focused functions.

# 4. Error Handling

How to handle errors correctly is very contextual. It depends on who the audience of the error is:
- **Audience is developers**: Give as much information as possible. It is very hard to solve problems unless developers have visibility and context around errors in production. This can be accomplished by implementing a logging strategy (aws-xray, aws-cloudwatch, serverless dashboard)
- **Audience is users**: 
   - Do they need to know about this error? Can default data or placeholder assets be shown instead without
   drawing attention to the error?
   - If they do need to know, how should we communicate this error?
   - Is it possible to share too much information in an insecure manner?
   - Is a simple message such as 'There was a problem on our end, we have been notified' good enough?

When determining errors, the team needs to understand the audience and the right way to communicate messages to its users.
This is as much a business question as it is a technical question. In this project, we are giving generic error messages simply for demo purposes. How you error handle depends on your context.
