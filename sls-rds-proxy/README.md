# Serverless RDS Proxy

User info:
Aurora MYSQL version
MYSQL version(We currently support Amazon RDS MySQL or Aurora MySQL, running on MySQL versions 5.6 or 5.7)

Read this before you integrating RDS PROXY to your RDS
https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/rds-proxy.html#rds-proxy.limitations

https://www.youtube.com/watch?v=ULRnn6tIYu8&feature=emb_title
https://github.com/aws-samples/amazon-rds-proxy-video-demo

testing:
https://artillery.io/docs/guides/guides/test-script-reference.html#Load-Phases
https://github.com/serverless-guru/templates/tree/master/sls-performancetesting/01_simple/performanceTesting/artillery
https://github.com/Nordstrom/serverless-artillery

Flows:
Create Aurora Mysql 
Create AWS Secret Manager
Amazon RDS Proxy
Configure Lambda function lambda need to be under vpc
API Gateway

https://www.notion.so/serverlessguru/Load-Testing-Serverless-Applications-With-Serverless-Artillery-cc5c4509c87b4c83a33e7e23965f6a3a

Flows:
Secret keys use for access -> RDS PROXY

https://aws.amazon.com/blogs/compute/using-amazon-rds-proxy-with-aws-lambda/#:~:text=Create%20and%20attach%20a%20proxy%20to%20a%20Lambda%20function&text=Scroll%20to%20the%20bottom%20of,and%20choose%20Add%20Database%20Proxy.&text=Follow%20the%20Add%20database%20proxy,IAM%20role%20you%20created%20earlier.

aws rds register-db-proxy-targets --db-proxy-name RDS-Proxy-Demo --target-group-name default --db-cluster-identifiers rds-dev-aurorardscluster-bw05qd5oozkd --profile serverlessguru-internal --region ca-central-1

aws rds generate-db-auth-token --hostname rds-proxy-demo.proxy-csbl7dcbtydc.ca-central-1.rds.amazonaws.com --port 3306 --region ca-central-1 --username master --profile serverlessguru-internal

mysql "host=rds-proxy-demo.proxy-csbl7dcbtydc.ca-central-1.rds.amazonaws.com port=3306 sslmode=verify-full sslrootcert=cert.pem dbname=rds user=master password=rds-proxy-demo.proxy-csbl7dcbtydc.ca-central-1.rds.amazonaws.com:3306/?Action=connect&DBUser=master&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=900&X-Amz-Credential=AKIAV2VWFLGIAGV6JWOM%2F20201012%2Fca-central-1%2Frds-db%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20201012T221734Z&X-Amz-Signature=746db3a5e906edf547f4c3a441289456c560a296f1629009ffc2d42bbff6564d"


https://aws.amazon.com/getting-started/hands-on/set-up-shared-database-connection-amazon-rds-proxy/

how can I verify Verifying connectivity for a proxy
https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html#rds-proxy-verifying

aws rds describe-db-proxy-targets --db-proxy-name rds-proxy-demo --region ca-central-1 --profile serverlessguru-internal

mysql -h rds-proxy-demo.proxy-csbl7dcbtydc.ca-central-1.rds.amazonaws.com --ssl-ca=cert.pem -P 3306 -u master -p

mysql -h rag5xr9i15n7ea.csbl7dcbtydc.ca-central-1.rds.amazonaws.com --ssl-ca=cert.pem -P 3306 -u master -p

https://aws.amazon.com/blogs/aws/amazon-rds-proxy-now-generally-available/
https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html#rds-proxy-connecting-iam
https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Connecting.html
https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Connecting.AWSCLI.html
https://aws.amazon.com/blogs/database/use-iam-authentication-to-connect-with-sql-workbenchj-to-amazon-aurora-mysql-or-amazon-rds-for-mysql/
https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html#rds-proxy-verifying
https://aws.amazon.com/blogs/architecture/how-to-design-your-serverless-apps-for-massive-scale/
https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html