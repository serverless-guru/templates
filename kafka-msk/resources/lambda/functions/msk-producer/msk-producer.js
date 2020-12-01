const sleep = require('util').promisify(setTimeout)
const kafka = require('kafka-node');
const Producer = kafka.Producer;

const SEND_MAX_RETRIES = 10;

const createKafkaProducer = (options) => {
  return new Promise((resolve, reject) => {
    try {
      const client = new kafka.KafkaClient(options);

      client.once('ready', function () {
        console.log('client ready');
      });

      client.on('error', function (err) {
        console.log('error on kafka client');
        console.log(JSON.stringify(err));

        reject(err);
      })

      client.on('socket_error', function (err) {
        console.log('error on kafka client (socket_error)');
        console.log(JSON.stringify(err));

        reject(err);
      })
      
      const producer = new Producer(client);

      producer.once('ready', function () {
        resolve(producer);
      });

      producer.on('error', function (err) {
        console.log('error on producer connection');
        console.log(JSON.stringify(err));

        reject(err);
      })
    } catch (e) {
      console.log('error on creating kafka producer');
      reject(e);
    }
  })
}

const sendMessage = (producer, topic, messages) => {
  return new Promise((resolve, reject) => {
    const messagesToSend = Array.isArray(messages) ? messages : [messages];

    const payloads = [
      { topic, messages: messagesToSend }
    ];

    producer.send(payloads, function (err, data) {
      if (err) {
        console.log('error sending the message', JSON.stringify(data));
        reject(err);
      }
      resolve(data);
    });
  })
}

const sendMessageToMSK = async ({ kafkaProducer, topic, messages, maxRetry = SEND_MAX_RETRIES }) => {
  let retry = 0;

  while (maxRetry > retry) {
    try {
      const mskResponse = await sendMessage(kafkaProducer, topic, messages);

      return mskResponse;
    } catch (e) {
      retry++;

      await sleep(1000 * (retry / 2));

      if (maxRetry == retry) {
        throw e;
      }

      console.log(`Retrying to send the message, attempt: ${retry}`);
    }
  }
}

module.exports = {
  sendMessageToMSK,
  createKafkaProducer
}