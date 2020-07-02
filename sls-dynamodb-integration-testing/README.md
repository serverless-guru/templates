# DynamoDB Integration Testing

In this project, we demonstrate how to make an integration test for a function interacting with DyanamoDB. 

When writing tests for our business logic, we often do not interact with outside resources. Either the business logic has no external dependencies, or we mock them to focus our test just on our business logic. But when it comes to validating our database functions work correctly, we must test them against a connected database. So where is that database located? And what kind of database should it be?

Ideally we are performing tests against a database in the cloud, but sometimes this is not possible, in which case we can spin up a local version of that resource on our local computer. In the case of DynamoDB, we can deploy our app under the stage of `test`, which will create all resources under a `test` stage, including our DynamoDB table.

Once we have deployed our test database, we can run jest tests that interact with this database. In the `package.json` file, we can see that the `test-int` command sets up a `TABLE` env variable pointing to our test database.

When we run our tests, we are able to hit the test database and validate that our database functions are interacting with DynamoDB correctly.

## Seeding
When we run tests, we sometimes want certain data representing certain scenarios to be in place in our database before testing. A common term for this is `seeding`. In `/src/db/_tests/utils` you will notice a helper module which handles seeding our database and removing all seeded data after our tests run successfully. 

It is important to always clean up our seeded data or data created by our tests after we are done, so future tests can have a clean database to then setup however the test needs for its testcase.