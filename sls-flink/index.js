'use strict';

module.exports.producer = async(event, context) => {
  const AWS = require("aws-sdk");

  const kinesis = new AWS.Kinesis({
    apiVersion: '2013-12-02'
  });
  
  console.log('@@@@@@@@@@@@@@')
  console.log(event)
  console.log('@@@@@@@@@@@@@@')

  try {
    return await new Promise((res, rej) => {
        const record = {
            Data: JSON.stringify({
                ...event,
                time: new Date()
            }),
            PartitionKey: 'partition-' + AWS.config.credentials.identityId
        };
    
        kinesis.putRecords({
            Records: [record],
            StreamName: 'sls-flink-dev-InputKinesisStream'
        }, function(err, data) {
            console.log('kinesis insertion finished')
            console.log('>>>>>>>>>>>>>>>>>>>')
            console.log(err)
            console.log('>>>>>>>>>>>>>>>>>>>')
            console.log(data)
            console.log('>>>>>>>>>>>>>>>>>>>')

            if (err) {
                console.error(err);
                return rej(err)
            }
    
            return res('success');
        });    
    })
  }
  catch (error) {
    console.log('index error: ', error)
  }
};

module.exports.consumer = async(event, context) => {
    console.log('***************')
    console.log(event)
    console.log('***************')

    return 'success'
};