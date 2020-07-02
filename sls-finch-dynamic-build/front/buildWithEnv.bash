#! /bin/bash

ENDPOINT=$(sls output get --name=ENDPOINT --app finch --service=sls-finch-example-back --stage=$STAGE | grep https) \
KEY=$(sls output get --name=KEY --app finch --service=sls-finch-example-back --stage=$STAGE) \
webpack
