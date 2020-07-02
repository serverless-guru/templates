# Introduction


Some really good resources:

- [Kent Becks Testing Good Practices](https://www.youtube.com/watch?v=5LOdKDqdWYU&list=PLlmVY7qtgT_lkbrk9iZNizp978mVzpBKl). Kent Beck (wrote a book on TDD, worked at Facebook), goes over best practices for testing, which are:
    - Isolated — tests should return the same results regardless of the order in which they are run.
    - Composable — if tests are isolated, then I can run 1 or 10 or 100 or 1,000,000 and get the same results.
    - Fast — tests should run quickly.
    - Inspiring — passing the tests should inspire confidence
    - Writable — tests should be cheap to write relative to the cost of the code being tested.
    - Readable — tests should be comprehensible for reader, invoking the motivation for writing this particular test.
    - Behavioral — tests should be sensitive to changes in the behavior of the code under test. If the behavior changes, the test result should change.
    - Structure-insensitive — tests should not change their result if the structure of the code changes.
    - Automated — tests should run without human intervention.
    - Specific — if a test fails, the cause of the failure should be obvious.
    - Deterministic — if nothing changes, the test result shouldn’t change.
    - Predictive — if the tests all pass, then the code under test should be suitable for production.

- [The Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) for an introduction to testing and the testing pyramid

- As a general rule, a good alocation of tests are 70/20/10, as is suggested in this [Google Testing Article](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)

This repository goes over the following:

### 1. How to use jest
In this section we go over:
- Introduction to Jest
- How to setup Jest
- What a typical testing workflow looks like
- How to test values that change over time
- How to generate coverage reports
- How to test external api errors
- How to refactor

This section includes:
- 7 Videos walking through the above topics
- the project used in the videos, both the start and end state

Links
- Click [here](./01-how-to-use-jest/intro-to-jest) to start this section


### 2. How to write testable code
In this section we go over:
- Adding features with tests to an existing legacy codebase
- General overview of how mocking can help make functions more testable

This section includes:
- 1 Video demonstrating Adding features with tests to an existing legacy codebase
- adding features project, both the start and end state
- Mocking overview documentation
- 1 Video talking through mocking overview documentation

Links
- Click [here](./02-how-to-write-testable-code/addingCodeToExistingProject/) to start the adding features section
- Click [here](./02-how-to-write-testable-code/mocking) to view the mocking overview documentation


### 3. How to test external services
In this section we go over:
- What is Ports and Adaptors
- How does Ports and Adaptors help us make integration tests
- How to make integration tests
- How to split up unit and integration test cli commands

This section includes:
- Documentation on Ports and Adaptors
- 1 Video walking through Ports and Adaptors documentation
- Reference Architecture which demonstrate integration testing
- 1 Video walking through the reference architecture codebase

Links
- [1. Ports and Adaptors Documentation](./03-how-to-test-external-services/01_howPortsAndAdaptorsCanHelpWithMocking)
- [2. Testing External Resources Example](./03-how-to-test-external-services/02_testingExternalResourcesExample)

