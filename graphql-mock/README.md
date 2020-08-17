# Graphql Mock Template
Enables rapid frontend development without having to wait for a backend implementation.

## Features
- Mono-service
- Multi-service
- Support for different scenarios (mocks) per service
- Graphql Playground per service

> [Architecture diagram](https://github.com/serverless-guru/templates/blob/master/graphql-mock/graphql-mock-architecture.png)
### Mono-Service details

Build a single service with your real graphql schema and custom mocks.

**Template example details**:

- Endpoint: {HOST}/{ENV}/graphql
- Lambda function path: `src/functions/graphql`
- Graphql schema path: `src/graphql/schema.js`
- Graphql mocks file path: `src/graphql/mocks.js`

**Playground**

Open the above endpoint in a browser and make sure the URL in the playground address box is the same.

**Curl example**

```curl
curl 'http://localhost:3000/dev/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:3000' --data-binary '{"query":"query {\n  todoItems {\n    id\n    completed\n    title\n  }\n  user {\n    id\n    name\n    createdAt\n  }\n}\n"}' --compressed
```

### Multi-Service details

Build as many services as you need with their graphql schema and mocks.

**Service folder structure**
```
src
  functions
    service-name
      mocks             --> Containes all different mocks/scenarios
        mock-1.js
        .
        .
        .
        mock-n.js
      handler.js        --> Lambda handler
      schema.js         --> Graphql schema
```

**Change scenario/mocks**

Different scenarios/mocks are managed by request headers, specifying the mock file name to be used.
- Request header name: `x-mock-name`

> Make sure `x-mock-name` header value matches one of the mock file names under the service mocks folder.


**Template example details**:

- Endpoint: {HOST}/{ENV}/service-a
- Lambda function path: `src/functions/service-a`
- Graphql schema path: `src/functions/service-a/schema.js`
- Graphql mocks files path: `src/functions/service-a/mocks/(default.js|active.js|inactive.js)`

**Playground**

Open a service endpoint in a browser and make sure the URL in the playground address box is the same.

**Curl example**

```curl
curl 'http://localhost:3000/dev/service-a' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:3000' -H 'x-mock-name: active' --data-binary '{"query":"query {\n  teamMembers {\n    id\n    name\n    surname\n    age\n    active\n  }\n}\n"}' --compressed
```

### Local development

#### Install dependencies
```
npm install
```

#### Run the project locally
```
sls offline
```