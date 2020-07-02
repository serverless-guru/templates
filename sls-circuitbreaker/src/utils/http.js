module.exports = {
    success: x => {
        return {
            statusCode: 200,
            body: JSON.stringify(x),
        }
    },

    validationError: x => {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: x
            }),
        }
    },

    serverError: x => {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: x
            }),
        }
    },

    transientError: x => {
        return {
            statusCode: 503,
            body: JSON.stringify({
                message: x
            }),
        }
    }
}
