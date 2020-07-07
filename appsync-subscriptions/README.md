# Appsync Subscription Pattern
- [1. How Appsync Subscriptions work](https://www.loom.com/share/e3c934579160417eb3a5f2b2e14666bb)
- [2. How to trigger a subscription from a Lambda function](https://www.loom.com/share/55fef05eb31a48a68bc5bbb19be97daa)

### AWS Demonstration of the same concept
- [Video](https://youtu.be/KrmFAcucjzQ)


### Authorization Options
- [Appsync Authorization Usecases](https://docs.aws.amazon.com/appsync/latest/devguide/security-authorization-use-cases.html)

For the subecsription, we can write vtl to check if the logged in user
matches the userId input or the PK of the item returned:

```vtl
#if(! ${context.result})
    $utils.unauthorized()
#elseif(${context.identity.cognitoIdentityId} != ${context.arguments.userId})
    $utils.unauthorized()
#else
    $util.toJson($ctx.result)
#end

```