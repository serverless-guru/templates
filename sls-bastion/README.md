# Serverless RDS (private) SSM Connection

## Purpose

This project simplify the way you connect to a RDS instance, without the need to configure and manage SSH keys inside your EC2 Bastion.

## Commands

### Requirements

- System: `Mac OS`;

- You need to have `AWS Session Manager Plugin` already installed in your machine;

- You need to update your `~/.ssh/config` file with this instructions:
```
# SSH over Session Manager
host i-* mi-*
    ProxyCommand sh -c "aws ssm start-session --target %h --document-name AWS-StartSSHSession --parameters 'portNumber=%p'"
```
source: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started-enable-ssh-connections.html

- You need to update your `serverless.yml` custom attributes for each stage that you want;

### Deploy 

```bash
npm install
serverless deploy
```

After your deploy has finished, you should see in your Terminal the ID of the EC2 Bastion instance (InstanceId). 

Example:
```
Received Stack Output {
  InstanceId: 'i-XXXXXXXXXXXXXXXX', <------------------------
  ServerlessDeploymentBucketName: 'sls-bastion-dev-serverlessdeploymentbucket-xxxxxxx'
}
```

![image](https://user-images.githubusercontent.com/232648/98142051-16bfb900-1ea6-11eb-83af-a981e7a15dcf.png)


You are going to need it to run the connection script at the next step.

### Connection Script

You are going to need to have one tab of your terminal opened exclusively for this execution.

If you use more then one AWS profile in your machine, you should start the script with `AWS_PROFILE=YOUR_PROFILE sh connect.sh`

```bash
sh connect.sh 
  --username ec2-user 
  --instanceid i-xxxxxxxxxxxx 
  --localport 2345 
  --rdsurl xxxxxxxxxxx.xxxxxxxxxxxx.us-east-2.rds.amazonaws.com 
  --rdsport 3306
```

```
Parameters:
--username [ Normally it's going to be "ec2-user" if you use the Amazon Linux image ]
--instanceid [ The ID of the EC2 instance. It was outputed in the previous step, or you can get it in your AWS Console -> EC2 -> Instances searching for the prefix "sls-bastion" ]
--localport [ Your tunnel local port ]
--rdsurl [ The RDS Endpoint, located at AWS Console -> RDS -> Databases -> Your Database -> Connectivity & security ]
--rdsport [ The RDS Port, located at AWS Console -> RDS -> Databases -> Your Database -> Connectivity & security ]
```

![image](https://user-images.githubusercontent.com/232648/98142462-951c5b00-1ea6-11eb-9d8b-e42d13a9113f.png)


## RDS Connection

To connect to the database you should use `localhost` as the Hostname. For the port, you should use the same port as you use as `localport` at the connect.sh script.

The credentials is the same configured at your RDS Database.

![image](https://user-images.githubusercontent.com/232648/98142520-a82f2b00-1ea6-11eb-8975-b6b600c1cdbc.png)
