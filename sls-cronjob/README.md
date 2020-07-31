# Serverless Cronjob

1. Installing
``` $ npm run install```

2. Configure
	2.1 Go to Amazon Simple Email Service and Email Addresses
	2.2 Click Verify New Email Address and type email that you want to use as a sender
	2.3 Click verify on your email
	2.4 Done!

Configure serverless.yml 

``` #serverless.yml
		iamRoleStatements:
				- Effect: Allow
					Action:
						- ses:SendEmail
						- ses:SendTemplatedEmail
					Resource: arn:aws:ses:#{AWS::Region}:#{AWS::AccountId}:identity/sender@gmail.com  # giving lambda permission to invoke ses
```

Replace sender email with email that you registered on Amazon Simple Email Service

3. local testing
``` $ sls invoke local -f cronjob ```

4. Deploy
``` $ sls deploy -v ```

