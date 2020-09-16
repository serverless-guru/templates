module.exports.hello = async (event) => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
            "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({
            message: "Response from API Gateway",
        }),
    }
}
