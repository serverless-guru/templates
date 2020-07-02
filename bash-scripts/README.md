# Less than 5MB zip

## Why?

AWS Lambda has cold start if greater than 5MB.

## How to use?

Copy the script into your deployment pipeline to auto-break deployments if the package size will be too large.