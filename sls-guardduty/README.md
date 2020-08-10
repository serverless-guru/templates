# Guard Duty service initialization
* This template initializes the Guard Duty service for the account and creates an SNS subscription using email to report Guard duty's findings.
* Guard duty has IPSet setting which is a list of IP addresses that are trusted for secure communication with AWS infrastructure and applications. GuardDuty doesn't generate findings for IP addresses that are included in IPSets.
* This setting is also being enabled through this template, but requires a file containing the IPs present in S3. Hence this template - [S3Deploy](https://github.com/serverless-guru/templates/tree/master/sls-s3deploy) should be deployed first. The outputs of S3Deploy stack is used in this Guard duty stack.
