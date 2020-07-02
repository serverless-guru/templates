const aws = require('aws-sdk');
//region can change, but you will need to ensure you are out of SES sandbox in the region of your choosing.
const ses = new aws.SES({ region: 'us-west-2' });

/**
 * @param {Object} params - Params for email template.
 * @param {String} params.Template - Template name. Defined in serverless.yml
 * @param {String} params.Source - Email's "From" field. Must be verified in SES console to send from.
 * @param {Object} params.Destination - Email's "To" field. Contains recipient, CC, and BCC.
 * @param {Array} params.Destination.ToAddresses - To address. Array of strings.
 * @param {Object} params.TemplateData - JSON object of inline variables that the template will use. For ease of use, the handler will convert this into the supported format for SES.
 */

module.exports.handler = async (params) => {
    // convert TemplateData to supported SES format.
    params.TemplateData = JSON.stringify(params.TemplateData).replace(`"`, `\"`).toString();
    try {
        ses.sendTemplatedEmail(params).promise();
    } catch (error) {
        console.log(error);
    }
}