# Example AppSync API

This will create an AppSync API with a single Lambda connection, lambda layer for dependencies, IAM role, and AppSync API.

* [Setup](#setup)
* [Deploy](#deploy)
* [Test](#test)

## Setup

Create .env file

```console
AWS_ACCESS_KEY_ID=XXXX
AWS_SECRET_ACCESS_KEY=XXXX
```

```console
$ npm run setup
```

## Deploy

### ALL

```console
$ npm run deploy all
```

### IAM

```console
$ npm run deploy iam
```

### Layer

```console
$ npm run deploy layer
```

### Lambda

```console
$ npm run deploy lambda
```

### AppSync

```console
$ npm run deploy appsync
```

## Test

### Steps

1. Navigate to AWS Console

2. Search for AWS AppSync and select your API

3. Open `Queries`

4. Add query and run

```graphql
query getUsersById {
  getUsersById(id: "1") {
    name
  }
}
```

5. View result

```json
{
  "data": {
    "getUsers": [
      {
        "name": "ryan"
      },
      {
        "name": "tyler"
      }
    ]
  }
}
```

### Steps if the component doesn't attach everything

1. Confirm that you have an API Key created

2. Manually copy the GraphQL schema in from this project (`components/appsync/src/schema.graphql`) and save the schema

3. Manually create a DataSource of AWS Lambda pointed at the lambda function you deployed in this stack (`components/lambda`)

4. Navigate to `Schema` in the AppSync console, select the GraphQL Query of `getUsers`, manually set the request mapping template and response mapping template copying from `components/appsync/src/vtl`

5. Open the queries tab and run

```graphql
query getUsers {
    getUsers {
        name
    }
}
```

6. View result

```json
{
  "data": {
    "getUsers": [
      {
        "name": "ryan"
      },
      {
        "name": "tyler"
      }
    ]
  }
}
```
