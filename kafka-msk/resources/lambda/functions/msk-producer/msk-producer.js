const { Kafka } = require('kafkajs');

const sendMessageToMSK = async (producer, topic, messages) => {
  const messagesToSend = Array.isArray(messages) ? messages : [messages];

  return await producer.send({ topic, messages: messagesToSend });
}

const createKafkaProducer = async ({ clientId, brokers }) => {
  const kafka = new Kafka({
    clientId,
    brokers
  });

  const producer = kafka.producer();
  await producer.connect();
  
  return producer;
}

module.exports = {
  createKafkaProducer,
  sendMessageToMSK
}