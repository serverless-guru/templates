const { callbackDb, promiseDb } = require('../aws')


module.exports = (data, callback) => {
    callbackDb.getUser(data.id, async function (err, userData) {
        if (!err) {
            // callbackDb.getUpcomingTrips(data.id, function (err, tripsData) {
            //     if (!err) {
            //         const result = {
            //             ...userData,
            //             upcomingTrips: tripsData
            //         }
            //         callback(null, result)
            //     } else {
            //         callback(true, 'Could not get trips')
            //     }
            // })
            try {
                const tripsData = await promiseDb.getUpcomingTrips(data.id)
                const result = {
                    ...userData,
                    upcomingTrips: tripsData
                }
                callback(null, result)
            } catch (e) {
                callback(true, 'Could not get trips')
            }
        } else {
            callback(true, 'Could not get user')
        }
    })
}