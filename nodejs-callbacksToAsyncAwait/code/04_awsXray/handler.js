var AWSXRay = require('aws-xray-sdk')
var AWS = AWSXRay.captureAWS(require('aws-sdk'))
const fetch = require('node-fetch')

// Helper function to make api calls instrumented with xray
const makeAsyncXrayCall = (name, action) => {
  return new Promise((res, rej) => {
    const rootSegment = AWSXRay.getSegment()

    // 1. Adding to existing Lambda Segment
    const newSubsegment = rootSegment.addNewSubsegment('rest-call')
    newSubsegment.addAnnotation('name', 'REST Call:' + name);
    newSubsegment.addMetadata('name', 'REST Call:' + name);

    AWSXRay.captureAsyncFunc('getAccountInfo', async function (subsegment) {

      // 2. Creating new Segment
      const newSegment = new AWSXRay.Segment('REST Call:' + name);
      newSegment.addAnnotation('name', 'REST Call:' + name);
      newSegment.addMetadata('name', 'REST Call:' + name);

      // Example of a promise
      // action()
      //   .then(x => {
      //     newSegment.close();
      //     subsegment.close()
      //     newSubsegment.close()
      //     res(x)
      //   })
      //   .catch(x => {
      //     newSegment.close();
      //     subsegment.close()
      //     newSubsegment.close()
      //     rej(x)
      //   })

      // Example using async await
      try {
        const x = await action()
        newSegment.close();
        subsegment.close()
        newSubsegment.close()
        res(x)
      } catch (e) {
        newSegment.close();
        subsegment.close()
        newSubsegment.close()
        rej(err)
      }
    })
  })
}

const io = {
  getTodos: async (data) => {
    let result = null
    await makeAsyncXrayCall('getAccountInfo', () => {
      return fetch('https://jsonplaceholder.typicode.com/todos/' + data.id)
        .then(x => x.json())
        .then(x => {
          result = x
        })
    })

    return result
  },

  storeItem: async (name) => {
    const dynamoDb = new AWS.DynamoDB.DocumentClient()
    const params = {
      TableName: process.env.TABLE,
      Item: {
        PK: '1234',
        name: name
      }
    }

    await dynamoDb.put(params).promise()
    return {
      id: '1234',
      name
    }
  }
}

module.exports.hello = async event => {
  const restResult1 = await io.getTodos({ id: 1 })
  const restResult2 = await io.getTodos({ id: 2 })
  await io.storeItem('test')

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data: restResult2
      }
    )
  }
}
