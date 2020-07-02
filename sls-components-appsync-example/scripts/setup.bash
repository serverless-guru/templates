#! /bin/bash

# Example (out-of-date):
# bash ./setup.bash AKIAXXXXXXXXX XXXXX+XXXXX

# Example (current):
# bash ./setup.bash

# access_key=$1
# secret_access_key=$2

echo "*** Setup -- Started ***"

# echo "*** Creating .env files for component directories ***"

# cat <<EOF >appsync/.env
# AWS_ACCESS_KEY_ID=$access_key
# AWS_SECRET_ACCESS_KEY=$secret_access_key
# EOF

echo "*** Copying .env file into component directories ***"

cp .env components/iam/
cp .env components/lambda/
cp .env components/appsync/
cp .env components/layer/

echo "*** Setup -- Ended ***"