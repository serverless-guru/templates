const { createKafkaProducer, sendMessageToMSK } = require('./msk-producer');

const APP_NAME = process.env.APP_NAME;
const MY_TOPIC = process.env.MY_TOPIC;
const KAFKA_HOST = process.env.KAFKA_HOST;

let kafkaProducer = null;
module.exports.handler = async (event, context) => {

  if (!kafkaProducer) {
    kafkaProducer = await createKafkaProducer({
      clientId: APP_NAME,
      brokers: KAFKA_HOST.split(',')
    });
  }

  const message = { value: JSON.stringify(event) };
  console.log(message);

  const mskResponse = await sendMessageToMSK(kafkaProducer, MY_TOPIC, message);
  console.log(mskResponse);
  
  return {
    statusCode: 200,
    body: "Success"
  }
}