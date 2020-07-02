# AWS XRay Tracing


### Step 1.
Add tracing config to the `serverless.yml` file under provider:
```yml
provider:
  name: aws
  runtime: nodejs12.x
  tracing:
    lambda: true
```

Insure that you have the correct permissions for our functions to interact with xray:

```yml
iamRoleStatements:
- Effect: Allow
    Action:
    - 'xray:PutTraceSegments'
    - 'xray:PutTelemetryRecords'
    Resource: 'arn:aws:xray:#{AWS::Region}:#{AWS::AccountId}:*'
```

Note: The above example uses the `serverless-pseudo-parameters`, which allows the use
of the `#{}` syntax.


### Step 2. 
Instrument your code with AWS XRay. An example can be viewed in the `handler.js` file.