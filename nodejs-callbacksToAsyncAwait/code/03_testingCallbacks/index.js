module.exports.callbackWithError = (cb) => {
    try {
        cb({
            data: 100
        })
    } catch (e) {
        cb(e)
    }
}

module.exports.asyncAwaitFunction = async () => {
    try {
        return {
            data: 100
        }
    } catch (e) {
        return e
    }
}