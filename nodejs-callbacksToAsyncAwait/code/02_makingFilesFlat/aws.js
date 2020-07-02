const callbackDb = {
    getUser: (id, callback) => {
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
    },
    getUpcomingTrips: (id, callback) => {
        setTimeout(() => {
            if (id !== 'ERROR') {
                callback(null, [
                    'trip1',
                    'trip2',
                    'trip3'
                ])
            } else {
                callback('ERROR', null)
            }
        }, 100)
    }
}

const promiseDb = {
    getUser: (id) => {
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
    },
    getUpcomingTrips: (id, callback) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (id !== 'ERROR') {
                    resolve([
                        'trip1',
                        'trip2',
                        'trip3'
                    ])
                } else {
                    reject('ERROR')
                }
            }, 100)
        })
    }
}

module.exports = {
    callbackDb,
    promiseDb
}