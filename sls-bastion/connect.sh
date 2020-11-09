#!/bin/bash

export AWS_PAGER=""

socket=$(mktemp 2>/dev/null || mktemp -t 'mytmpdir')
rm ${socket} 

exit_code=0

while [ $# -gt 0 ]; do

  if [[ $1 == *"--"* ]]; then
      param="${1/--/}"
      declare $param="$2"
  fi

  shift
done

if [ -z "$slsorg" ]
then
  echo "Add your Serverless Dashboard Pro Org name"
  read slsorg
fi

if [ -z "$slsapp" ]
then
  echo "Add your Serverless Dashboard Pro App name"
  read slsapp
fi

if [ -z "$slsservice" ]
then
  echo "Add your Serverless Dashboard Pro Service name"
  read slsservice
fi

if [ -z "$slsstage" ]
then
  echo "Add your Serverless Dashboard Pro Stage name"
  read slsstage
fi

export AWS_ACCESS_KEY_ID=$(sls output get --name AccessKey --org $slsorg --app $slsapp --service $slsservice --stage $slsstage)
export AWS_SECRET_ACCESS_KEY=$(sls output get --name SecretKey --org $slsorg --app $slsapp --service $slsservice --stage $slsstage)
export AWS_REGION=$(sls param get --name AWS_REGION --org $slsorg --app $slsapp --service $slsservice --stage $slsstage)

username="ec2-user"
instanceid=$(sls output get --name InstanceId --org $slsorg --app $slsapp --service $slsservice --stage $slsstage)

az=`aws ec2 describe-instances --instance-ids $instanceid --query "Reservations[0].Instances[0].Placement.AvailabilityZone" --output text`
retVal=$?
if [ $retVal -ne 0 ]; then
    exit $retVal
fi

keyFileName="ec2instconnect.$RANDOM"
ssh-keygen -f $keyFileName -q -N ''

aws ec2-instance-connect send-ssh-public-key --instance-id $instanceid --availability-zone $az --instance-os-user $username --ssh-public-key file://$keyFileName.pub
#>/dev/null
retVal=$?
if [ $retVal -ne 0 ]; then
    rm $keyFileName $keyFileName.pub
    exit $retVal
fi

if [ -z "$localport" ]
then
  echo "Localhost Tunnel Port"
  read localport
fi

if [ -z "$rdsurl" ]
then
  echo "RDS Instance Url"
  read rdsurl
fi

if [ -z "$rdsport" ]
then
  echo "RDS Instance port"
  read rdsport
fi

cleanup () {
    # Stop SSH port forwarding process, this function may be
    # called twice, so only terminate port forwarding if the
    # socket still exists
    if [ -S ${socket} ]; then
        echo
        echo "Sending exit signal to SSH process"
        ssh -S ${socket} -O exit $username@$instanceid
        rm $keyFileName $keyFileName.pub
    fi
    exit $exit_code
}

trap cleanup EXIT TERM

echo "Creating the tunnel..."

shift
ssh -M -S ${socket} -fnNT -L $localport:$rdsurl:$rdsport -i $keyFileName $* $username@$instanceid

ssh -S ${socket} -O check $username@$instanceid

echo "Tunnel Created!"

read -rsn1 -p "Press any key to close session."; echo

ssh -S ${socket} -O exit $username@$instanceid

rm $keyFileName $keyFileName.pub