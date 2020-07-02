let api = {};

api.handler = async event => {
    return {
        statusCode: 200,
        body: JSON.stringify(event)
    }
};

module.exports = api;