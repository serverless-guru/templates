const { awsCallback, awsPromise } = require('./aws')

module.exports.useCallback = (data, callback) => {
    awsCallback(1, (err, data) => {
        if (!err) {
            callback(data)
        } else {
            callback(err)
        }
    })
}

module.exports.usePromiseWithThen = (data, callback) => {
    awsPromise(1)
        .then((result) => {
            callback(result)
        })
        .catch(err => {
            callback(err)
        })
}

module.exports.usePromiseWithAsync = async () => {
    try {
        const result = await awsPromise(1)
        return result
    } catch (e) {
        return e
    }
}








