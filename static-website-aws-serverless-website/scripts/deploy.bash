#! /bin/bash

stage=$1
region=$2

echo "*** Deploying website with stage of $stage in $region ***"

serverless client deploy --stage $stage --region $region