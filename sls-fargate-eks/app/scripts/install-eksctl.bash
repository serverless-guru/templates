#! /bin/bash

# Documentation
# https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html

echo "*** Installing eksctl ***"
curl --silent --location "https://github.com/weaveworks/eksctl/releases/download/latest_release/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp

echo "*** Move path ***"
# sudo mv /tmp/eksctl /usr/local/bin
mv /tmp/eksctl $HOME/bin/eksctl && export PATH=$PATH:$HOME/bin

echo "*** Validate installation ***"
eksctl version