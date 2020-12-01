const { createKafkaProducer, sendMessageToMSK } = require('./msk-producer');

const ADH_TOPIC = process.env.ADH_TOPIC;
const KAFKA_HOST = process.env.KAFKA_HOST;

let kafkaProducer = null;

module.exports.handler = async (event, context) => {
  try {
    const message = JSON.stringify(event);

    if (!kafkaProducer) {
      kafkaProducer = await createKafkaProducer({ kafkaHost: KAFKA_HOST });
    }

    const mskResponse = await sendMessageToMSK({ kafkaProducer, topic: ADH_TOPIC, messages: [message] });
    console.log(JSON.stringify({ sendMessageResponse: mskResponse }));

  } catch (e) {
    console.log('ERROR during execution');
    console.log(JSON.stringify(e));

    throw e;
  }

  return {
    statusCode: 200,
    body: "Success"
  }
}