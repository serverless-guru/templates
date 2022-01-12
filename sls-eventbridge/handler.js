'use strict';

const scheduledService = async (event) => {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'scheduledService lambda function call through EventBridge scheduling rule!',
        input: event,
      },
      null,
      2
    ),
  };
};

const invoiceService = async (event) => {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'invoiceService lambda function call through EventBridge custom pattern matching!',
        input: event,
      },
      null,
      2
    ),
  };
};

const rewardService = async (event) => {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'rewardService lambda function call through EventBridge custom pattern matching!',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports = {
  scheduledService,
  invoiceService,
  rewardService
};