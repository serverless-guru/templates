**Instructions**

1. Run `npm install` 
2. On `Line:28` and `Line:37`  inside of `serveless.yml` replace `AWS_ACCOUNT_NUMBER` with your account number.
3. Run `build`
4. Run `serverless deploy`

`Scheduled` function will be executed every 10 minutes. 

`Hello` function can be executed from AWS Console, or using AWS Command Line interface:

`aws lambda invoke --function-name c-sharp-layer-dev-hello result.json`

Check the `result.json` file to see the response.

Check `CloudWatch` for functions logs.

Normally you would want to have layers and functions separated into 2 stacks. For the sake of simplicity this example contains both in a single stack. If you receive an error that the layer does not exist, comment out lines 27,28 and 36,37 then deploy the stack. Uncomment lines and then deploy stack again. 
