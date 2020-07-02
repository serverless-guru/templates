# Delete non-empty S3 bucket

## Purpose

Show how to use the `serverless-s3-remover` plugin to remove non-empty S3 buckets.

## Why

Limitations with AWS S3 + AWS CloudFormation. You must empty the S3 bucket then delete it. This is restrictive, if you run `sls remove` then `sls deploy`, but put objects into your bucket. It will throw errors saying the `s3 bucket already exists`.

## Steps

* `npm install --save-dev serverless-s3-remover`

* Add plugins section

```yaml
plugins:
    - serverless-s3-remover
```

* Add bucket names to empty + delete

```yaml
custom:
    base: ${self:service}-${self:provider.stage}
    s3:
        bucketA:
            name: ${self:custom.base}-my-awesome-bucket
        bucketB:
            name: ${self:custom.base}-my-other-cool-bucket
    remover:
        buckets:
            - ${self:custom.s3.bucketA.name}     # bucket name
            - ${self:custom.s3.bucketB.name}
```

* Deploy - `sls deploy -v`

* Add file

```bash
$ echo "hello" > hello.txt
$ aws s3 cp hello.txt s3://s3-remover-dev-my-awesome-bucket --profile serverlessguru
$ aws s3 cp hello.txt s3://s3-remover-dev-my-other-cool-bucket --profile serverlessguru

upload: ./hello.txt to s3://s3-remover-dev-my-awesome-bucket/hello.txt
upload: ./hello.txt to s3://s3-remover-dev-my-other-cool-bucket/hello.txt
```

* Remove without plugin

```bash
$ sls remove -v

Serverless Error ---------------------------------------
 
  An error occurred: S3Bucket - The bucket you tried to delete is not empty (Service: Amazon S3; Status Code: 409; Error Code: BucketNotEmpty; Request ID: 7BEA4BA803D4BBBA; S3 Extended Request ID: dh9PL69BNqB0TUVjm498Gkg+4VZ7nJ07fpXl5CHdQVrobq0Yv826FNihL6cNv42OsoMYpZo7acY=).
 
Get Support --------------------------------------------
```

* Remove with plugin

```console
sls remove -v

Serverless: Success: s3-remover-dev-my-awesome-bucket is empty.
S3 Remover: Success: s3-remover-dev-my-awesome-bucket is empty.
Serverless: Success: s3-remover-dev-my-other-cool-bucket is empty.
S3 Remover: Success: s3-remover-dev-my-other-cool-bucket is empty.
Serverless: Getting all objects in S3 bucket...
Serverless: Removing objects in S3 bucket...
Serverless: Removing Stack...
Serverless: Checking Stack removal progress...
Serverless: Stack removal finished...
```