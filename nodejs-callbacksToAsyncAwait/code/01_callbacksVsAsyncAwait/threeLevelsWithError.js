const { awsCallback, awsPromise } = require('./aws')

module.exports.useCallback = (data, callback) => {
    awsCallback(1, (err, data) => {
        if (!err) {
            awsCallback(1, (err, data) => {
                if (!err) {
                    awsCallback('ERROR', (err, data) => {
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
                    awsPromise('ERROR')
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
        awsPromise('ERROR')
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
        const result3 = await awsPromise('ERROR')
        return result3

    } catch (e) {
        return e
    }
}

module.exports.usePromiseWithAsyncOverkill = async () => {
    try {
        let result1 = null
        try {
            result1 = await awsPromise(1)
        } catch (e) {
            return e
        }

        let result2 = null
        try {
            result2 = await awsPromise(1)
        } catch (e) {
            return e
        }

        let result3 = null
        try {
            result3 = await awsPromise('ERROR')
        } catch (e) {
            return e
        }

        return result3
    } catch (e) {
        return e
    }
}