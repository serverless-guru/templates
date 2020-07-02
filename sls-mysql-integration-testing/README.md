# MySQL Integration Testing

In this project, we demonstrate how to make an integration test for a function interacting with MySQL. 

When writing tests for our business logic, we often do not interact with outside resources. Either the business logic has no external dependencies, or we mock them to focus our test just on our business logic. But when it comes to validating our database functions work correctly, we must test them against a connected database. So where is that database located? And what kind of database should it be?

Ideally we are performing tests against a database in the cloud, but sometimes this is not possible, in which case we can spin up a local version of that resource on our local computer. In the case of AWS Aurora, the database lives inside a VPC and is not publically available for connection. A common way to test integrations between code and mysql is to instead spin up a docker container locally with a mysql image. This way we can validate our interactions with mysql are operating as expected. Testing that our code is correctly connecting to an Aurora Database in the cloud can be validated in an E2E or Acceptance test.

## Using Docker
To get started, we first need to build a docker image. Inside the `/docker` folder, you will find a `Dockerfile` which includes instructions for the building of a docker image. In this example, we are using `mysql:5.7`, setting some env variables, and specifying a file to use to initialize the data in the database. You will want to customize this file for your project to reflect your projects tables, table structure, and a useful starting point for your data. 

Once everything is defined correctly, run `docker build -t projectname-mysql .`, naming the image whatever best reflects your database (in this example, we named it projectname-mysql).

Now that the image is built, you will be able to start this docker container by running `npm run start-db`, which can be found in `/code/package.json`. This is an npm script that runs the docker command for you. Feel free to instead run the docker command yourself if you prefer. We have also added a `stop-db` npm script to easily stop the docker container.

## Running Integration Tests
Once the docker container is started, we are able to run our integration tests. (Note: Sometimes docker needs a bit of time to start, so if you run the integration tests immediatly after starting docker, they may fail. This may be because docker as not fully initialized. If you encounter this, wait a few seconds and try the tests again). Inside `/code/src/_tests/insert.int-test.js`, you will notice a helper function to make a connection. The credientials will connect locally to the mysql database defined in our docker container. 


## Seeding
When we run tests, we sometimes want certain data representing certain scenarios to be in place in our database before testing. A common term for this is `seeding`. We are accomplishing an initial seed of data by inserting some default data in our built image. The inserted data can be found here: `/docker/database-setup.sql`. Every time we stop and start our container, the database will be initialized to the data defined in this file.

It is important to always clean up our seeded data or data created by our tests after we are done, so future tests can have a clean database to then setup however the test needs for its testcase. Good practice is to have a clean up phase in our integration tests.