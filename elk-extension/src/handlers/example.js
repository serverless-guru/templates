const fs = require('fs');

let logStorage = {};

exports.handler = async event => {
    let { headers, path, httpMethod, pathParameters } = event;
    let traceId = headers['x-amzn-trace-id'];

    logStorage[traceId] = {
        headers, path, httpMethod, pathParameters, traceId
    };

    logMessages(10, traceId, event, randomString(10));

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

const logMessages = (amount, traceId, event, randomString) => {
    for (i = 0; i < amount; i++) {
        console.log({ number: i, traceId, randomString, data: JSON.stringify(event) });
    }
}

const randomString = (times) => {
    let string = '';

    for (i = 0; i < times; i++) {
        string += Math.random().toString(36).substring(2, 15);
    }
    
    return string;
}