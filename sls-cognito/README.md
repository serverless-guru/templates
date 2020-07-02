# Protecting endpoints with AWS Cognito and a Shared Authorizer

In this template, we demonstrate how to define in one service the following:
- ApiGateway
- Cognito User Pool
- Shared Authorizer

Once these resources are defined, we will set the following as outputs, which will be shared with the rest of our services that are attached to Serverless Dashboard. These outputs are the following:
- ApiEndpoint
- ApiId
- ApiResourceId
- AuthorizerId

With these outputs, we can attach all other services to the same ApiGateway and protect all of them with the same Shared Auhorizer.

# Video Walkthough
- [Here is a link to a Video Walkthrough](https://www.loom.com/share/36a9f26a61bb4dd088e048547119302b)