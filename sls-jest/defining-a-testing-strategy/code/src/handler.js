const db = require('./db')

const httpResponse = {
    success: x => ({
        statusCode: 200,
        body: JSON.stringify(x)
    }),

    validationError: x => ({
        statusCode: 400,
        body: JSON.stringify({ message: x })
    }),

    serverError: x => ({
        statusCode: 500,
        body: JSON.stringify({ message: x })
    })
}


module.exports.save = async (input) => {
    const data = JSON.parse(input.body)

    // 1. validate the data
    if (!data.id) {
        return httpResponse.validationError('Must have an id')
    }

    if (!data.name) {
        return httpResponse.validationError('Must have a name')
    }

    if (!data.price) {
        return httpResponse.validationError('Must have a price')
    }

    // 2. get pic or error
    const { pic, picError } = await db.getPic(data.id)
    if (picError) {
        return httpResponse.serverError(picError)
    }

    // 3. get tweet or default
    let { tweet, tweetError } = await db.getTweet(data.id)

    // 4. save highlighted or error
    const { highlighted, highlightedError } = await db.saveHighlighted({
        ...data,
        pic: pic.url,
        tweet: tweetError ? 'Default tweet message' : tweet
    })
    if (highlightedError) {
        return httpResponse.serverError(highlightedError)
    }

    // 5. return success
    return httpResponse.success(highlighted)
}




