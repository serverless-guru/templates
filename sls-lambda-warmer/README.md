# Serverless Lambda Warmer

## Configuration

### Defining Lambdas

Currently, the Lambdas need to be hardcoded into index.js in the `lambdaArnList` array. The Lambda names must be passed to the `AWS.Lambda.invoke()` function as strings. In accordance with the AWS SDK documentation, your Lambda identifiers can be any of the following name formats:

* Function name - my-function (name-only), my-function:v1 (with alias).
* Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.
* Partial ARN - 123456789012:function:my-function.

### Defining concurrency

Concurrency defaults to 1, but can be set during deployment by using the `--concurrency` flag. Alternatively you can change or hardcode the default value here:
```
concurrency: ${opt:concurrency, '1'}
```

### Changing the invocation schedule
This is run off of a recurring CloudWatch Event, and as such, the rate can be changed to your liking. Your mileage may vary when it comes to the upper limit of time between triggers before seeing cold starts again, but you can change the schedule by updating:
```
      - schedule: rate(15 minutes)
```