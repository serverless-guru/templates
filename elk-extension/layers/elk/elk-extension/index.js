#!/usr/bin/env node
const { register, next } = require('./extensions-api');
const { subscribeToLogsAPI, MAX_ITEMS, MAX_BYTES, TIMEOUT_MS } = require('./logs-api');
const { createHTTPServer } = require('./http-server');
const registeredDestinations = require('./destinations/index').registeredDestinations();

const AWS = require('aws-sdk');

const EXTENSION_LOG_MAX_ITEMS = process.env.EXTENSION_LOG_MAX_ITEMS || MAX_ITEMS;
const EXTENSION_LOG_MAX_BYTES = process.env.EXTENSION_LOG_MAX_BYTES || MAX_BYTES;
const EXTENSION_LOG_TIMEOUT_MS = process.env.EXTENSION_LOG_TIMEOUT_MS || TIMEOUT_MS;

/** Store logs from Lambda Logs API */
const logs = [];

AWS.config.update({
    region: process.env.REGION
});

const EventType = {
    INVOKE: 'INVOKE',
    SHUTDOWN: 'SHUTDOWN',
};

const handleShutdown = async (event) => {
    console.log('shutdown', { event });
    process.exit(0);
}

const handleInvoke = async (event) => {
    console.log('invoke', { event })
}

(async function main() {
    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

    const extensionId = await register();
    console.log('extensionId', extensionId);

    // Create local HTTP Server
    createHTTPServer(logs);

    // Subscribe to Logs API
    const logsAPISubscription = await subscribeToLogsAPI(
        {
            extensionId,
            subscribeTo: ['function'],
            maxItems: Number(EXTENSION_LOG_MAX_ITEMS),
            maxBytes: Number(EXTENSION_LOG_MAX_BYTES),
            timeoutMs: Number(EXTENSION_LOG_TIMEOUT_MS)
        }
    );
    console.log('Logs API subscription', { logsAPISubscription });

    // execute extensions logic

    while (true) {
        console.log('next');
        const event = await next(extensionId);

        while (logs.length > 0) {
            const logBatch = logs.shift();
            // await uploadLogsToS3(logBatch);
            await Promise.all(
                registeredDestinations.map(async ({ sendLogs }) => {
                    await sendLogs(logBatch);
                })
            )
        }
        // Uncomment to add logic on INVOKE and SHUTDOWN events.
        // switch (event.eventType) {
        //     case EventType.SHUTDOWN:
        //         await handleShutdown(event);
        //         break;
        //     case EventType.INVOKE:
        //         await handleInvoke(event);
        //         break;
        //     default:
        //         throw new Error('unknown event: ' + event.eventType);
        // }
    }
})();