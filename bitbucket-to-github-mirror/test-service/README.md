# Test Service

## What is this for?

To test the BitBucket to GitHub integration. I'm using this test service.

## What will happen

1. I created a separate repository with this code called `test-service` on BitBucket and GitHub

2. I created a Serverless Framework Pro app called `test-service`

3. I setup a GitHub access token and BitBucket app password

4. I setup a `dev` profile with the required Serverless Framework Pro params for GitHub and BitBucket authentication

5. I setup a CI/CD for the `test-service` app which if a push happens on the `master` branch it will trigger a deployment to our `dev` stage

6. I setup a webhook on the `test-service` BitBucket repo which has the API Gateway URL from our main `serverless.yml`

7. I cloned the BitBucket repo locally and pushed this code to `master`

8. I watched the CW logs for the `bitbucket-to-github-mirror` `/webhook` lambda to see if it synced correctly

9. I switched to Serverless Framework Pro dashboard to see if the CI/CD deployments started properly