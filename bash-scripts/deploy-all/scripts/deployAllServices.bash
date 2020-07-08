#! /bin/bash

stage=$1
region=$2

root_path=./services

if [[ -z $stage ]] || [[ -z $region ]];
then
    echo "missing stage or region"
    exit 1
fi

# export SLS_DEBUG=*

mkdir -p tmp
mkdir -p tmp/services

# ********** Service Deployments **********

service_names=("user" "billing" "feed")
for service_name in "${service_names[@]}"
do
    echo "Starting ** $service_name deployment"
	cd $root_path/$service_name
    nohup sls deploy --stage $stage --region $region > ../../tmp/services/$service_name.out 2>&1 &
    cd ../../
done

# View results in the tmp/services/ directory at the root of the repository, each service outputs a file of their deployment