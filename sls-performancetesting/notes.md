
# User Experience
Below 150ms is great
Below 300ms is acceptable

These numbers are based on user perception, these numbers may not be relevant
to non user facing endpoints.

# Cost 
This is contextual. The less time functions take, the less they will cost.
One way to optimize costs is to answer the question:
- Should we optimize for reads?
- Should we optimize for writes?




# Questions that need answers

How do we work with services that use databases?
    - How do we seed data? npm script in pipeline
    - How to we remove data once the test is done? npm script in pipeline

Which deployed resources do we run tests against?
    - test stage that is already deployed from previous E2E testing
    - dedicated performance testing stage

What do we do about shared databases and resources?
    - you should aim to keep each service's data private

How often do we run performance tests?
    - This depends on cost

What are the goal metrics we are trying to hit with our tests?
    - HTTP user facing endpoints: under 150ms is great, under 300ms is acceptable

How do we run perfomance tests:
    - Serverless Artillery

How do we see the results:
    - SLS Dashboard or Cloudwatch (generated dashboards)
