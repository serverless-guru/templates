module.exports.handler = async (event, context) => {

  if (!event.hasOwnProperty('records')) {
    throw new Error('This is not a Kafka event');
  }

  // Iterate through keys
  for (let key in event.records) {
    console.log('Key: ', key)
    // Iterate through records
    event.records[key].map((record) => {
      console.log('Record: ', record)
      // Decode base64
      const message = Buffer.from(record.value, 'base64').toString()
      console.log('Message:', message)
      // Here you can perform any action with the message
    })
  }
  
  return {
    statusCode: 200,
    body: "Success"
  }
}