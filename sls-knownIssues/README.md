## Serverless Limitations

- Maximum of 15 minutes execution time
- Rarely used Lambda functions may have cold starts
- Everything in Serverless must be stateless, all persistent state must be stored elsewhere

## Frequent issues developers face during everyday coding tasks

### 1. Code in source control and code deployed are out of sync
This can happen when we are making edits to the code that is already deployed (in the interest of decreasing our feedback loop).
In order to solve this, we instead only edit our source code and deploy, and never edit what is already been deployed in the lambda console.

Here is a video demonstrating the solution:
- [Dealing with Out Of Sync Deployments](https://www.loom.com/share/e7e9af38c5d34cf2bd4edefb55e8a865)


### 2. Triggering and observing logs of our Lambda functions involves lots of page / menu diving in the AWS Console
Navigating to the Lambda console to trigger a function, and then navigating to the Cloudwatch console to view logs
can feel tedious and time consuming. Instead, we can use the terminal and the Serverless Frameoworks cli to 
easily trigger and view logs of our Lamdas while staying the context of our code editor. 

Here is a video demonstrating the solution:
- [How to Invoke and Log Lambda Functions](https://www.loom.com/share/0f4ca3edc7ff480fa6fd6cd6c344ee99)


### 3. Deploying Lambda Functions on every change creates very long feedback loops and slows developement down
Running `sls deploy` after every change in our code can make developement feel very slow. Troubling shooting can become
painful. To shorten this feedback loop, we can structure our code in such a way where most of it is decoupled from our
Lambda specific code. Once its decoupled, we can instead run unit tests on our business logic, which can give us feedback
much faster than having to deploy after every change.


Here is a video demonstrating the solution:
- [Gaining Fast Feedback with Unit Tests](https://www.loom.com/share/f1b631d2cbad417293c8aff38855630a)

### 4. Resources such as databases and environment variables are not always in place when deploying to `qa` and `prod`
Serverless architectures involve a lot more resources than traditional actitectures. It can be difficult to keep track
of all the resources our service depends on. To insure we have all resources in place to deploy, we define as much as possible
in our `serverless.yml` file. If its defined, then we dont need to remember it, it simply gets deployed to whichever stage
we specify. 

Here is a video demonstrating the solution:
- [Validating Resource Config](https://www.loom.com/share/6e04e7fade6d435ba72fbd9aeffffa32)


### 5. How do I know my service works with everybody elses service?

Often Serverless applications are 1 among many. Different teams or individuals are responsible for different Serverless applications, 
and when they are all deployed, we need to make sure what we build works with what everyone else has built. There are many
ways to validate this, the easiest way to stay in sync while developing is to make accuratly mocked inputs.

Here is a video demonstrating the solution:
- [Mocking Input](https://www.loom.com/share/a3c8c75efefb413f908e786ea86de199)
