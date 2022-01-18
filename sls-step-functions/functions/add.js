module.exports.handler = async (event, context) => {
  return event.number1 + event.number2;
};