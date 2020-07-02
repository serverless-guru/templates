module.exports.handler = async event => {

  const content = JSON.parse(event.body);
  const length = content.message.length;

  return {
    statusCode: 200,
    body: JSON.stringify({'response': `Your message is ${length} characters long`})
  }
};