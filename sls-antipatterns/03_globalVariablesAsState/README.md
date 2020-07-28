# Global State in Lamba Functions

Keeping track of global state in a Lambda Function is undesireable because Lambda Functions executing one after the other will share the container originally spun up by the first Lambda execution. This means global variables will carry over to the next invocation. 

In the code contained in this folder, we have a counter global variable. If this serverless project is deployed, you will be able to hit the endpoint and watch the counter increase every time as long as the same container is being used. 

If the global state is intended to keep track of state for 1 single invocation rather than multiple invocations, the behavior will be very unpredictable.