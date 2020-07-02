/**
 * 1. Callback version of aws call
 * This function returns nothing, but executes code its given
 * 
 */
const awsCallback = (id, callback) => {
    setTimeout(() => {
        if (id !== 'ERROR') {
            callback(null, {
                id,
                name: 'John Smith',
                tripsTaken: 20
            })
        } else {
            callback('ERROR', null)
        }
    }, 100)
}


/**
 * 2. Promise version of aws call
 * This function returns a promise
 * 
 */
const awsPromise = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id !== 'ERROR') {
                resolve({
                    id,
                    name: 'John Smith',
                    tripsTaken: 20
                })
            } else {
                reject('ERROR')
            }
        }, 100)
    })
}

module.exports = {
    awsCallback,
    awsPromise
}