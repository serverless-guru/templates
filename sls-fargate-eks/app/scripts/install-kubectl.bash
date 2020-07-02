#! /bin/bash

# Documentation:
# https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html
# https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html

echo "*** Check if Kubectl is installed ***"
kubectl_version=$(kubectl version --short --client)

if [[ $kubectl_version ]];
then
    echo "kubectl version: $kubectl_version is already installed"
else
    echo "*** Installing Kubectl 1.14 depending on OS type ***"
    if [[ "$OSTYPE" == "linux-gnu" ]]; then

        echo "*** Linux detected ***"

        echo "*** Download kubectl ***"
        curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
        
        echo "*** Download aws-iam-authenticator ***"
        curl -o aws-iam-authenticator https://amazon-eks.s3-us-west-2.amazonaws.com/1.14.6/2019-08-22/bin/linux/amd64/aws-iam-authenticator

    elif [[ "$OSTYPE" == "darwin"* ]]; then

        echo "*** MacOS detected ***"
        curl -o kubectl https://amazon-eks.s3-us-west-2.amazonaws.com/1.14.6/2019-08-22/bin/darwin/amd64/kubectl
        
    fi

    echo "*** Applying execute permissions ***"
    chmod +x ./kubectl
    chmod +x ./aws-iam-authenticator

    echo "*** Updating path kubectl ***"
    mkdir -p $HOME/bin 
    cp ./kubectl $HOME/bin/kubectl

    echo "*** Copy aws-iam-authenticator to bin folder ***"
    cp ./aws-iam-authenticator $HOME/bin/aws-iam-authenticator 

    export PATH=$PATH:$HOME/bin

    echo "*** Check the Kubectl version ***"
    $HOME/bin/kubectl version --short --client

    echo "*** Check the aws-iam-authenticator version ***"
    $HOME/bin/aws-iam-authenticator version

fi