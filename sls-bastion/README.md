# Serverless RDS (private) SSM Connection

## Purpose

This project simplify the way you connect to a RDS instance, without the need to configure and manage SSH keys inside your EC2 Bastion.

![image](https://github.com/MaksimAniskov/aws-ssh-bastion-ssm/raw/master/README.images/architecture-private.svg)

## Commands

### Requirements

- You need to have `AWS CLI` already installed in your machine;

- You need to have `AWS Credentials` already configured in your machine;

- You need to have `AWS Session Manager Plugin` already installed in your machine; [Docs](https://docs.aws.amazon.com/systems-manager/latest/userguide/
session-manager-working-with-install-plugin.html)

On Mac:
```
curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/mac/sessionmanager-bundle.zip" -o "sessionmanager-bundle.zip"
unzip sessionmanager-bundle.zip
sudo ./sessionmanager-bundle/install -i /usr/local/sessionmanagerplugin -b /usr/local/bin/session-manager-plugin
```

Verify:
```
session-manager-plugin
```

- You need to update your `~/.ssh/config` (if you are using Windows and have git installed, the path is probably `c:\Program Files\Git\etc\ssh\ssh_config`) file with this instructions:
```
# SSH over Session Manager
host i-* mi-*
    ProxyCommand sh -c "aws ssm start-session --target %h --document-name AWS-StartSSHSession --parameters 'portNumber=%p'"
```
source: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started-enable-ssh-connections.html

- You need to configure this variables at Serverless Dashboard Pro:
```
AWS_REGION
SSM_BASTION_VPC_ID
SSM_BASTION_CIDR_IP
SSM_BASTION_ROUTE_TABLE_ID_1
SSM_BASTION_SUBNET_ID_1
```

### Deploy Bastion

```bash
serverless deploy --stage <slsprostage> -v
```

### Bastion Connection Script

You are going to need to have one tab of your terminal opened exclusively for this execution.

```bash
serverless login

sh connect.sh 
  --localport 2345 
  --rdsurl xxxxxxxxxxx.xxxxxxxxxxxx.us-east-2.rds.amazonaws.com 
  --rdsport 3306
  --slsorg xxxxxxxxxxxxx
  --slsapp xxxxxxxxxx
  --slsservice xxxxxxxxxx
  --slsstage xxxxxxxxxx
```

```
Parameters:
--localport [ Your tunnel local port ]
--rdsurl [ The RDS Endpoint, located at AWS Console -> RDS -> Databases -> Your Database -> Connectivity & security ]
--rdsport [ The RDS Port, located at AWS Console -> RDS -> Databases -> Your Database -> Connectivity & security ]
--slsorg [ Your Serverless Dashboard Pro Org name ]
--slsapp [ Your Serverless Dashboard Pro App name ]
--slsservice  [ Your Serverless Dashboard Pro Service name ]
--slsstage  [ Your Serverless Dashboard Pro Org stage ]
```

![image](https://user-images.githubusercontent.com/232648/98142462-951c5b00-1ea6-11eb-9d8b-e42d13a9113f.png)


## RDS Connection

To connect to the database you should use `localhost` as the Hostname. For the port, you should use the same port as you use as `localport` at the connect.sh script.

The credentials is the same configured at your RDS Database.

![image](https://user-images.githubusercontent.com/232648/98142520-a82f2b00-1ea6-11eb-8975-b6b600c1cdbc.png)
