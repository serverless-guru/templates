const AWS = require('aws-sdk');
const REGION = process.env.REGION;
const CONCURRENCY = process.env.CONCURRENCY;

const lambda = new AWS.Lambda({
    apiVersion: '2015-03-31',
    region: REGION
});

const lambdaArnList = [
    // Lambda ARNs go here
];

exports.handler = function () {    
    try {
        for (let index = 0; index < CONCURRENCY; index++) {
            invokeLambdas(lambdaArnList);
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }    
}

invokeLambdas = async (lambdaArray) => {    
    for (const lambdaInstance of lambdaArray) {
        let params = {
            FunctionName: lambdaInstance
        };

        lambda.invoke(params, function (err, data) {
            if (err) console.log('Invoke Error',err, err.stack);
            else console.log('Invoke Success',data);
        });        
    }
}