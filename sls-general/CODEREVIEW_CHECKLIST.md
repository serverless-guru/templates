# Code Review of Application Code
- If new code includes callbacks, do we have a good reason for it?
- Are names semantic and meaningful?
- Does the code consider failures? Messages, information, error handling
- Prefer modern javascript syntax such as async await over callbacks
- Should certain functionality be abstracted into a helper function for others to make use of?
- Is there any complex code that requires documentation
- Is documentation on functions, methods, classes, contexts, and behaviours adequate?

# Code Review of Test Code
- Test should be able to run in any order. To insure this, we must validate that tests do not rely on any state outside of the test
- Tests should only test 1 thing at a time
    - 'it works'
    - 'Test Case 1'
    - 'works based on data we give it'
- Tests should avoid more than 10 expect statements. This is a sign that it may be testing more than 1 thing.
When testing an object with 5 properties, rather than write 5 expects with `.toBe`, write 1 expect with `.toEqual`. This allows you to confirm a full object is what you expect it to be with 1 expectatation.
- Unit Tests should be small and focused, and should not need lots of mocking. This depends a lot on the code you are testing. When tests are big and hard to mock, its a sign that the code is big and many types of code (business logic, IO) are mixed together. Big tests may be the only option until code is refactored.

