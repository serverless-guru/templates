#!/bin/bash

export AWS_PAGER=""

socket=$(mktemp -t deploy-ssh-socket)
rm ${socket} 

exit_code=0

while [ $# -gt 0 ]; do

  if [[ $1 == *"--"* ]]; then
      param="${1/--/}"
      declare $param="$2"
  fi

  shift
done

if [ -z "$username" ]
then
  echo "Add your EC2 username"
  read username
fi

if [ -z "$instanceid" ]
then
  echo "Add your EC2 instance ID"
  read instanceid
fi

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