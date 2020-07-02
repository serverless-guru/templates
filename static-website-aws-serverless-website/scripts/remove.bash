#! /bin/bash

stage=$1
region=$2

echo "*** Removing website with stage of $stage in $region ***"

serverless client remove --stage $stage --region $region