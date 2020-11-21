const fs = require('fs');

let logStorage = {};
const logFilePath = '/tmp/logs.json';

exports.handler = async event => {
    console.log('***')
    let { headers, path, httpMethod, pathParameters } = event;
    let traceId = headers['x-amzn-trace-id'];

    logStorage[traceId] = {
        headers, path, httpMethod, pathParameters, traceId
    };

    console.log({ traceId, data: JSON.stringify(event) });
    console.log({ traceId, data: JSON.stringify(event) });
    console.log({ traceId, data: JSON.stringify(event) });
    console.log({ traceId, data: JSON.stringify(event) });
    console.log({ traceId, data: JSON.stringify(event) });
    console.log({ traceId, data: JSON.stringify(event) });

    return {
        statusCode: 200,
        body: JSON.stringify(event),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': '*'
        }
    }
};