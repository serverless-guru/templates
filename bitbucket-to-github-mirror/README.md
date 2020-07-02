## Highlights

* Push to BitBucket triggers API Gateway which triggers AWS Lambda

* AWS Lambda clones the BitBucket repository onto the AWS Lambda then pushes the latest code to GitHub

* Once the code hits GitHub it triggers the Serverless Framework Pro CI/CD which will deploy the updates

## Supports

* nodejs12.x runtime

## Issues

`nodegit` is a native npm module, we can't package from MacOS and directly upload. Meaning we need to build a Docker container and deploy from there. Below are the steps.

## Steps

1. Create a BitBucket private repo & create a GitHub private repo

2. Create an app password with BitBucket & create a Github personal access token

3. Setup Serverless Framework Pro org, app, profile with AWS IAM role deployment, and profile params matching environment variables listed in `serverless.yml`

4. Create a Serverless Framework Pro personal access key

5. Install Docker + Start Docker + Run `docker build -t git-mirror-lambda .` to build deployment container locally

6. Run `docker run -it git-mirror-lambda /bin/bash` to get inside the container

7. Run `cd /app` to get into right folder

8. Run `export SERVERLESS_ACCESS_KEY=XXXXXXXXX` swapping in your Serverless Framework Personal access key

9. Run `sls deploy --stage dev --region us-west-2 -v` swapping in your desired `stage` and `region`

10. Create a BitBucket webhook copying the API URL printed in the terminal after deployment

11. Run `sls logs -f webhook --stage dev --region us-west-2 -t` to listen for logs

12. Push a file into your BitBucket Repo and watch the Lambda log come through the terminal output

13. Navigate to GitHub repository to see the latest commit
