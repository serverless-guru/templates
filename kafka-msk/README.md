# Kafka - MSK
Infrastructure as Code for Amazon Managed Streaming for Apache Kafka (MSK).

## Stacks
- VPC
- MSK (Kafka cluster and brokers)
- Client Machine (EC2 Instance)
- SSM Parameters (Kafka Cluster host/port pairs connections)
- Lambda (Kafka producer and consumer examples)

## Deployment Steps

#### Deploy VPC stack
Resources
- VPC
- 2 Private Subnets
- Route Table

Outputs
- kafkaVPC (VPC ID)
- PrivateSubnet1Id
- PrivateSubnet2Id

#### Deploy MSK stack
Resources
- MSK Cluster
- Security Group

Outputs
- MSKClusterArn
- MSKSecurityGroup

#### Deploy Client Machine stack
Resources
- EC2 Instance
- IAM Instance Profile
- IAM Role
- Security Group
- 3 Security Group Ingress Rules on the MSKSecurityGroup (MSK stack)

Outputs
- MSKClientMachine (EC2 Instance ID)

> With AMI IDs for us-east-1 and us-east-1 regions.

#### Deploy SSM Parameters stack
Resources
- 2 SSM Parameters

Outputs
- BootstrapBrokerStringParameter
- BootstrapBrokerStringTLsParameter

#### ZooKeeper connection and Bootstrap broker string
In AWS console, go to MSK service, find the kafka cluster we deployed in previous steps and click on cluster name.
Click on "View client information" button. Now you have to copy 3 values that will be used in the next steps.

- Copy `Bootstrap servers:TLS` value.
- Copy `Bootstrap servers:Plaintext` value.
- Copy `ZooKeeper connection:Plaintext` value.

#### Update SSM Parameter store with bootstrap broker strings

In AWS console, then System manager, parameter store. You will find 2 new parameters:
- /kafka-msk-ssm-params-[ENV]/broker-string
- /kafka-msk-ssm-params-[ENV]/broker-string-tls

Update the value of this param: `/kafka-msk-ssm-params-[ENV]/broker-string` with the value you copied previously (`Bootstrap servers:Plaintext`).

Update the value of this param: `/kafka-msk-ssm-params-[ENV]/broker-string-tls` with the value you copied previously (`Bootstrap servers:TLS`).

#### Deploy lambda stack
Resources
- Lambda function producer
- Lamdba function consumer
- Lambda EventSource Mapping for MSK cluster
- 2 Security Groups
- 2 Security Group Ingress Rules on the MSKSecurityGroup (MSK stack)

## Create KafKa topic

In AWS console, go to EC2 and find the client machine instance (KafkaClientInstance-[ENV])
Logging into the instance by selection the isntance, and click connect, then Session manager and then click "Connect".

Inside the client machine do the following steps:
````bash
bash
sudo su
su -l ec2-user

cd kafka/kafka_2.12-2.2.1/

# Create topic
bin/kafka-topics.sh --create --zookeeper "[Zookeeper connection VALUE]" --replication-factor 2 --partitions 1 --topic [TOPICNAME]
````
> The [Zookeeper connection VALUE] is the value you copied in previous steps(`ZooKeeper connection:Plaintext`)