#!/usr/bin/env node
const { register, next } = require('./extensions-api');
const AWS = require('aws-sdk');
const fs = require('fs');


AWS.config.update({
    region: process.env.REGION
});

const lambda = new AWS.Lambda({ maxRetries: 1 });

const EventType = {
    INVOKE: 'INVOKE',
    SHUTDOWN: 'SHUTDOWN',
};

const logFilePath = '/tmp/logs.json';

function readLogFile() {
    return new Promise(resolve => {
        fs.readFile(logFilePath, 'utf8', (err, data) => {
            if (err) {
                // TODO: Better error handling
                console.log('error reading log file', err);
                resolve();
            } else {
                console.log('read file to json');
                resolve(JSON.parse(data));
            }
        });
    });
}

async function invokeELKLambda (lambdaLog) {
    // invoke ELK lambda and don't wait for it to finish
    console.log('lambdaLog', lambdaLog);
    let invokeResponse = await lambda.invoke({
        FunctionName: process.env.ELK_LAMBDA_NAME,
        InvocationType: 'Event',
        LogType: 'None',
        Payload: JSON.stringify(lambdaLog)
    }).promise();
    return invokeResponse;
}

async function handleShutdown(event) {
    console.log('shutdown', { event });

    // read /tmp/logs.json file and return JSON
    let logStorageJson = await readLogFile();

    // build traceIds array from /tmp/logs.json file
    let traceIds = Object.keys(logStorageJson);

    console.log(JSON.stringify(logStorageJson, null, 2));

    console.log('traceIds', traceIds);

    let elkInvokeResponses = await Promise.all(
        traceIds.map(async traceId => {
            console.log('logStorageJson[traceId]', logStorageJson[traceId]);
            let elkInvokeResponse = await invokeELKLambda(logStorageJson[traceId]);
            return elkInvokeResponse
        })
    );
    console.log('elkInvokeResponses', elkInvokeResponses);
    process.exit(0);
}

async function handleInvoke(event) {
    console.log('invoke', { event })
}

(async function main() {
    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

    console.log('hello from extension');

    console.log('register');
    const extensionId = await register();
    console.log('extensionId', extensionId);

    // execute extensions logic

    while (true) {
        console.log('next');
        const event = await next(extensionId);
        switch (event.eventType) {
            case EventType.SHUTDOWN:
                await handleShutdown(event);
                break;
            case EventType.INVOKE:
                await handleInvoke(event);
                break;
            default:
                throw new Error('unknown event: ' + event.eventType);
        }
    }
})();