const uuidv4 = require("uuid4");

exports.handler = async function (event, context) {
  console.log(`uuid - ${uuidv4}`);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};
