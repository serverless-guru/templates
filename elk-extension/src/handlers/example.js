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

    try {
        await this.logMessage({traceId, data: JSON.stringify(event)});
        await this.logMessage({traceId, data: JSON.stringify(event)});
        await this.logMessage({traceId, data: JSON.stringify(event)});
        await this.logMessage({traceId, data: JSON.stringify(event)});
        await this.logMessage({traceId, data: JSON.stringify(event)});
        await this.logMessage({traceId, data: JSON.stringify(event)});
        await this.saveLog()
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
        await this.logMessage({traceId, data: JSON.stringify(event)});
        await this.logMessage({traceId, data: JSON.stringify(event)});
        await this.logMessage({traceId, data: JSON.stringify(event)});
        await this.logMessage({traceId, data: JSON.stringify(event)});
        await this.logMessage({traceId, data: JSON.stringify(event)});
        await this.saveLog()
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
    let logEvent = {
        type: 'Message',
        timestamp: new Date().toISOString(),
        data
    };
    if(!logStorage[traceId].logs) {
        logStorage[traceId] = {
            logs: [ logEvent ]
        }
    } else {
        logStorage[traceId].logs.push(logEvent)
    }
};

exports.saveLog = () => {
    return new Promise(resolve => {
        // TODO: add error handling
        try {
            if (fs.existsSync(logFilePath)) {
                //file exists
                // append to existing JSON
                fs.readFile(logFilePath, 'utf8', (err, data) => {
                    if (err) {
                        // TODO: Better error handling
                        console.log(err);
                        resolve();
                    } else {
                        let existingLogStorage = JSON.parse(data);
                        existingLogStorage = {...existingLogStorage, ...logStorage};
                        fs.writeFile(logFilePath, JSON.stringify(existingLogStorage), 'utf8', (err) => {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log('writeFile success');
                            }
                            resolve();
                        });
                    }
                });
            } else {
                fs.writeFile(logFilePath, JSON.stringify(logStorage), 'utf8', err => {
                    if (err) {
                        console.log("writeFile failed: " + err);
                        resolve();
                    } else {
                        console.log('writeFile success');
                        resolve();
                    }
                });
            }
        } catch(err) {
            console.error(err)
            resolve();
        }
    });
};