const p = require('phin');
const reqURL = process.env.SLACK_WEBHOOK_URL;
const slackChannel = process.env.SLACK_CHANNEL_NAME;

async function notifySlack() {

  const message = {
    'channel': `${slackChannel}`,
    'username': 'Lambda-Slack-Demo',
    'text': 'Slack Notification Demo!',
    'icon_emoji': ':aws:',
    'attachments': [{
      'color': '#8697db',
      'fields': [
        {
          'title': 'Slack Notification Demo',
          'value': 'Slack notification sent successfully!',
          'short': true
        }
      ]
    }]
  };

  return p({
    url: `${reqURL}`,
    method: 'POST',
    data: message
  });
}

exports.handler = async function (event, context) {
    await notifySlack();
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Slack notification sent successfully!"
        },
        null,
        2
      ),
    };
  };