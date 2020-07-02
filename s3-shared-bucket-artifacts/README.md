# Serverless Framework with shared S3 Artifacts bucket

**Note:** In this example, we are using Serverless Framework Pro features. Please, adapt and modify for your use case if you do not use this service.

The current folder structure in this repository is:

```bash
resources/
  s3/
    serverless.yml
services/
  serviceA/
    serverless.yml
  serviceB/
    serverless.yml
  serviceC/
    serverless.yml
.gitignore
README.md
```

When using Serverless Framework, the default behaviour is to create a S3 bucket for each `serverless.yml` file, since they are treated as separated project.

[You can easily hit the soft limit of 100 S3 buckets in AWS](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html) and depending on your workload, you can even hit the 1,000 limit.

In this template, you can find a `/resources/s3/serverless.yml`, where we define a S3 as our artifact target that will be used by `/services/service{A,B,C}`.

**We are reusing a single bucket for multiple projects**, helping reduce the burden of creating multiple S3 buckets for Serverless Framework applications in your account.

## Expected Outcome

![](https://dev-to-uploads.s3.amazonaws.com/i/zt1h3tzoejycdq54wgj6.png)

![](https://dev-to-uploads.s3.amazonaws.com/i/1f7kdwqlns6aky4rj8wa.png)

![](https://dev-to-uploads.s3.amazonaws.com/i/ndm40l9jwgzf382c68ap.png)

![](https://dev-to-uploads.s3.amazonaws.com/i/t0kw1suuvsdv6nck9b24.png)
