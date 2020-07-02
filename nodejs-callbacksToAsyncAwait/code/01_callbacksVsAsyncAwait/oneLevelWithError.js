const { awsCallback, awsPromise } = require('./aws')

module.exports.useCallback = (data, callback) => {
    awsCallback('ERROR', (err, data) => {
        if (!err) {
            callback(data)
        } else {
            callback(err)
        }
    })
}

module.exports.usePromiseWithThen = (data, callback) => {
    awsPromise('ERROR')
        .then((result) => {
            callback(result)
        })
        .catch(err => {
            callback(err)
        })
}

module.exports.usePromiseWithAsync = async () => {
    try {
        const result = await awsPromise('ERROR')
        return result
    } catch (e) {
        return e
    }
}








