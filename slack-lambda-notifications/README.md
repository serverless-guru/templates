# Slack Notification via AWS Lambda

## Purpose

Send notification to your Slack channel.

## Steps

### Create Slack Webhook Url

See [Documentation](https://slack.com/intl/en-in/help/articles/115005265063-Incoming-webhooks-for-Slack).

### Install required packages

```bash
npm install

```

### Update lambda environments in serverless.yml

```yaml
environment:
  SLACK_WEBHOOK_URL: #Your Slack Webhook Url
  SLACK_CHANNEL_NAME: #Your Slack channel name for notifications
```

### Deploy to AWS account

```
sls deploy
```
