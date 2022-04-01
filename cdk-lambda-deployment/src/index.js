exports.handler = async function(event) {
    console.log("event--", event);
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/json" },
      body: JSON.stringify({ message: "Hello from Lambda!" })
    };
  };