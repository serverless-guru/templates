#! /bin/bash

# Example (current):
# bash ./deploy.bash all | lambda | iam | layer

what_to_deploy=$1

echo "*** Deployment -- Started ***"

if [[ $what_to_deploy == 'all' ]];
then
    echo "*** Deploying IAM Role ***"

    (cd components/iam && sls deploy --debug)

    sleep 120

    echo "*** Deploying Lambda Layer ***"

    (cd components/layer && sls deploy --debug)

    echo "*** Deploying Lambda Function ***"

    (cd components/lambda && sls deploy --debug)

    echo "*** Deploying AppSync ***"

    (cd components/appsync && sls deploy --debug)
elif [[ $what_to_deploy == 'lambda' ]];
then
    echo "*** Deploying Lambda Function ***"

    (cd components/lambda && sls deploy --debug)
elif [[ $what_to_deploy == 'iam' ]];
then
    echo "*** Deploying IAM Role ***"

    (cd components/iam && sls deploy --debug)
elif [[ $what_to_deploy == 'layer' ]];
then
    echo "*** Deploying Lambda Layer ***"

    (cd components/layer && sls deploy --debug)
elif [[ $what_to_deploy == 'appsync' ]];
then
    echo "*** Deploying AppSync ***"

    (cd components/appsync && sls deploy --debug)
fi

echo "*** Deployment -- Finished ***"