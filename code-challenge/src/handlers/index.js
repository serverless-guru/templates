const request = require('request');

exports.handler = async event => {
    console.log('event', event);
    console.log(`client_id: ${process.env.client_id}`);
    console.log(`client_secret: ${process.env.client_secret}`);
    return {
        statusCode: 200,
        body: JSON.stringify(event)
    }
};