#!/bin/bash -e

region=$1
profile=$2
type=$3 # angular, vue, react
repository=$(sls param get --name repositoryName)
testBucket=$(sls param get --name testBucket)
productionBucket=$(sls param get --name productionBucket)
dir=$(pwd)

# default profile if not passed
if [[ -z $profile ]];
then
  profile="default"
fi

# default region if not passed
if [[ -z $region ]];
then
  stage="us-east-1"
fi

# no repository param
if [[ -z $repository ]];
then
  echo "repositoryName param not set"
  exit 2
fi

# no test bucket param
if [[ -z $testBucket ]];
then
  echo "testBucket param not set"
  exit 2
fi

# no production bucket 
if [[ -z $productionBucket ]];
then
  echo "productionBucket param not set"
  exit 2
fi

# deploy infra
sls deploy --stage prod --region $region --aws-profile $profile 

# CodeCommit credential helper - you must have GitCredentials
# https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-gc.html
git config --global credential.helper '!aws --profile '"$profile"' codecommit credential-helper $@'

echo "*** Create frontend app ***"
if [[ "$type" == "angular" ]]; then

  echo "*** Angular detected ***"

  # install angular cli
  npm i -g @angular/cli

  # generate angular app

  cd /
  ng new frontend --directory="$dir/../frontend" --defaults=true
  cd $dir
  # prepare production buildspec file
  sed s%\${BUCKET}%$productionBucket%g ./buildspecs/angular/buildspec.yml > $dir/../frontend/buildspec.yml 

  cd $dir/../frontend/

  git remote add origin https://git-codecommit.$region.amazonaws.com/v1/repos/$repository

  # push to master 
  git add .
  git commit -m "production buildspec setup"
  git push origin master

  # prepare test buildspec file
  git checkout -b development
  sed s%\${BUCKET}%$testBucket%g ./buildspecs/angular/buildspec.yml > $dir/../frontend/devbuildspec.yml 
  git add .
  git commit -m "test buildspec setup"
  git push -u origin development

elif [[ "$type" == "react"* ]]; then

  echo "*** React detected ***"

  cd ..
  npx create-react-app frontend

  cd $dir
  # prepare production buildspec file
  sed s%\${BUCKET}%$productionBucket%g ./buildspecs/react/buildspec.yml > $dir/../frontend/buildspec.yml 
  cd $dir/../frontend/
  git remote add origin https://git-codecommit.$region.amazonaws.com/v1/repos/$repository

  # push to master 
  git add .
  git commit -m "production buildspec setup"
  git push origin master

  # prepare test buildspec file
  git checkout -b development

  cd $dir
  sed s%\${BUCKET}%$testBucket%g ./buildspecs/react/buildspec.yml > $dir/../frontend/devbuildspec.yml 
  cd $dir/../frontend/
  
  git add .
  git commit -m "test buildspec setup"
  git push -u origin development

elif [[ "$type" == "vue"* ]]; then

  echo "*** Vue detected ***"
  npm install -g @vue/cli @vue/cli-service-global
  cd ..
  vue create frontend --default

  # prepare production buildspec file
  cd $dir
  sed s%\${BUCKET}%$productionBucket%g ./buildspecs/vue/buildspec.yml > $dir/../frontend/buildspec.yml 
  cd $dir/../frontend/

  git remote add origin https://git-codecommit.$region.amazonaws.com/v1/repos/$repository

  # push to master 
  git add .
  git commit -m "production buildspec setup"
  git push origin master

  # prepare test buildspec file
  git checkout -b development

  cd $dir
  sed s%\${BUCKET}%$testBucket%g ./buildspecs/vue/buildspec.yml > $dir/../frontend/devbuildspec.yml 
  cd $dir/../frontend/

  git add .
  git commit -m "test buildspec setup"
  git push -u origin development

fi

