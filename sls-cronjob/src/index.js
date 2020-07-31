'use strict';
const AWS = require('aws-sdk');
const region = process.env.REGION;
const cloudformation = new AWS.CloudFormation({ region: region });
const ses = new AWS.SES();

const listStacks = async () => {
	var params = {
		StackStatusFilter: [
			'CREATE_FAILED',
			'CREATE_COMPLETE',
			'ROLLBACK_FAILED',
			'ROLLBACK_COMPLETE',
			'DELETE_FAILED',
			'UPDATE_COMPLETE',
			'UPDATE_ROLLBACK_FAILED',
			'UPDATE_ROLLBACK_COMPLETE',
			'IMPORT_COMPLETE',
			'IMPORT_ROLLBACK_FAILED',
			'IMPORT_ROLLBACK_COMPLETE'
		]
	};

	const data = await cloudformation.listStacks(params).promise();

	const result = data.StackSummaries.filter(el => {
		return el.DriftInformation['StackDriftStatus'] === 'DRIFTED'
	})

	return result;
}

const handler = async () => {
	try {
		const result = await listStacks();

		// creating stack drift list
		const lists = result.map(el => {
			return el.StackName
		})

		// creating params
		var params = {
			Destination: { /* required */
				ToAddresses: [
					'nadtakan.jones@gmail.com',
				]
			},
			Message: { /* required */
				Body: { /* required */
					Text: {
						Data: lists.join('\r\n'), /* required */
						Charset: 'UTF-8'
					}
				},
				Subject: { /* required */
					Data: `CloudFormation Stack Drift reporting on region ${region}`, /* required */
					Charset: 'UTF-8'
				}
			},
			Source: 'nadtakan@serverlessguru.com' /* required */
		};

		// sending email
		ses.sendEmail(params).promise();
	} catch (e) {
		console.log(e)
	}
}
module.exports = { handler };
