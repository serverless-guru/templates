const { awsCallback, awsPromise } = require('./aws')

module.exports.useCallback = (data, callback) => {
    awsCallback(1, (err, data) => {
        if (!err) {
            awsCallback(1, (err, data) => {
                if (!err) {
                    awsCallback(1, (err, data) => {
                        if (!err) {
                            callback(data)
                        } else {
                            callback(err)
                        }
                    })
                } else {
                    callback(err)
                }
            })
        } else {
            callback(err)
        }
    })
}

module.exports.usePromiseWithThen = (data, callback) => {
    awsPromise(1)
        .then((result) => {
            awsPromise(1)
                .then((result) => {
                    awsPromise(1)
                        .then((result) => {
                            callback(result)
                        })
                        .catch(err => {
                            callback(err)
                        })
                })
                .catch(err => {
                    callback(err)
                })
        })
        .catch(err => {
            callback(err)
        })
}

module.exports.usePromiseWithPromisAll = (data, callback) => {
    Promise.all([
        awsPromise(1),
        awsPromise(1),
        awsPromise(1)
    ])
        .then(data => {
            callback(data[0])
        })
        .catch(err => {
            callback(err)
        })
}

module.exports.usePromiseWithAsync = async () => {
    try {
        const result1 = await awsPromise(1)
        const result2 = await awsPromise(1)
        const result3 = await awsPromise(1)
        return result3
    } catch (e) {
        return e
    }
}