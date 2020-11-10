const { uuid } = require('uuidv4');
let logStorage = {};

exports.handler = async event => {
    let { headers, path, httpMethod, pathParameters } = event;
    let traceId = headers['x-amzn-trace-id'];

    logStorage[traceId] = {
        headers, path, httpMethod, pathParameters, traceId
    };

    try {
        await this.logMessage({traceId, data: JSON.stringify(event)});
        return {
            statusCode: 200,
            body: JSON.stringify(event),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': '*'
            }
        }
    } catch (error) {
        await this.logMessage({traceId, data: JSON.stringify(event)});
        return {
            statusCode: 500,
            body: 'error in the backend',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': '*'
            }
        };
    }
};

exports.logMessage = async ({traceId, data}) => {
    if (process.env.DEBUG_MODE == "true") {
        console.log(data);
    }
    logStorage[traceId].messages[uuid()] = {
        type: 'Message',
        timestamp: new Date().toISOString(),
        data
    }
};