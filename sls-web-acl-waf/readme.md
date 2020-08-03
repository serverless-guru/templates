# SLS-WEB-ACL-WAF

Installing
1. go to sls-api-gateway-waf
2. deploy code run ``` sls deploy -v```
3. run ``` cd ```
4. deploy web acl waf run ``` sls deploy -v```
5. all done

![alt text](https://imgur.com/c6cMS8p.png)


Notes: 
1. AWS not allow to use AWS::WAFv2::WebACLAssociation so we have to use aws cli. 
ref https://stackoverflow.com/questions/59673364/aws-waf-create-an-acl-and-rule-to-allow-access-to-only-one-country-to-access-the

2. sls-web-acl-association is not working.