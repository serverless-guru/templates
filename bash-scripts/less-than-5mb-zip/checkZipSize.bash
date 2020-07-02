#! /bin/bash

service_name="less-than-5mb-zip"

sls package

zip_size=$(ls -l .serverless/$service_name.zip | awk '{print $5}')

echo "Zip size: $zip_size"

if [[ $zip_size -lt 5000000 ]];
then
    echo "zip is lower than 5MB"
    echo "continuing with deployment"
    exit 0
else
    echo "zip is greater than 5MB"
    echo "breaking deployment"
    exit 1
fi