const AWS = require("aws-sdk");

// You can find out all the resources, filter by type
const resources = serverless.service.provider.compiledCloudFormationTemplate.Resources;

const kinesisanalyticsv2 = new AWS.KinesisAnalyticsV2({apiVersion: '2018-05-23', region: "us-east-2"});

const params = {
    ApplicationName: 'sls-flink-new-kda-dev-sampleApplication',
    RunConfiguration: {
        ApplicationRestoreConfiguration: {
            ApplicationRestoreType: "RESTORE_FROM_LATEST_SNAPSHOT"
        },
        FlinkRunConfiguration: {
            AllowNonRestoredState: true
        }
    }
};

kinesisanalyticsv2.startApplication(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});