# Serverless Cloudtrail PCI Compliance
### Description
Template to create a CloudTrail trail to log, continuously monitor, and retain account activity related to actions across your AWS infrastructure.

### Installation
Run `$ npm install`

### Local Testing
* `$ sls print --profile <aws-profile>` _prints all compiled values in serverless.yml file to console_
* `$ sls deploy --profile <aws-profile>` _deploys stack to dev environment_
* `$ sls remove --profile <aws-profile>` _removes stack in dev environment_

### Options:
Default values are set to meet PCI Compliance standards
*Profile:* _Required_ AWS profile used for deployment. Maps to .aws/credentials values
*Region:* AWS Region to deploy stack to. Default: us-west-2
*Stage:* Staging environment. Default: dev
*IncludeGlobalServiceEvents:* Specifies whether the trail is publishing events from global services such as IAM to the log files. Default: true
*IsMultiRegionTrail:* Specifies whether the trail applies only to the current region or to all regions. Default: true