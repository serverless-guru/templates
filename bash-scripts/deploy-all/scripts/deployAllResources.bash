#! /bin/bash

stage=$1
region=$2

root_path=./resources

if [[ -z $stage ]] || [[ -z $region ]];
then
    echo "missing stage or region"
    exit 1
fi

# export SLS_DEBUG=*

mkdir -p tmp
mkdir -p tmp/resources

# ********** Resource Deployments **********

resource_names=("cognito" "api")
for resource_name in "${resource_names[@]}"
do
    echo "Starting ** $resource_name deployment"
	cd $root_path/$resource_name
    nohup sls deploy --stage $stage --region $region > ../../tmp/resources/$resource_name.out 2>&1 &
    cd ../../
done

# View results in the tmp/resources/ directory at the root of the repository, each service outputs a file of their deployment