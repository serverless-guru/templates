// test layer dependency
// const dyna = require('@dynatrace/oneagent');
const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const lokijs = require('lokijs');
const md5 = require('md5');

// return Users to test appsync response
exports.handler = async event => {
    console.log('event', event);
    switch(event.fieldName) {
        case "getUsers":
            return {
                "xyz": { name: "ryan"},
                "zab": { name: "tyler"}
            };
        default:
            return `Field of ${event.field} not found`;
    }
};