
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
    - How do we seed data? (possibly npm script in pipeline, need to add to pattern)
    - How to we remove data once the test is done? (possibly npm script in pipeline, need to add to pattern)

Which deployed resources do we run tests against?
    - test stage that is already deployed from previous E2E testing?
    - dedicated performance testing stage?

What do we do about shared databases and resources?
    - ideally you dont have them?
    - what if we have them anyways, what should we do?

How often do we run performance tests?
    - on every PR?
    - only on merges into master?

What are the goal metrics we are trying to hit with our tests?
    - Answer: HTTP user facing endpoints: under 150ms is great, under 300ms is acceptable

How do we run perfomance tests:
    - Answer: Serverless Artillery (have example project)

How do we see the results:
    - Answer: SLS Dashboard or Cloudwatch (generated dashboards)
