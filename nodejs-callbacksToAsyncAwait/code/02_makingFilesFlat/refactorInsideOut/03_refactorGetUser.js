const { callbackDb, promiseDb } = require('../aws')


module.exports = (data, callback) => {
    // callbackDb.getUser(data.id, async function (err, userData) {
    //     if (!err) {
    //         try {
    //             const tripsData = await promiseDb.getUpcomingTrips(data.id)
    //             const result = {
    //                 ...userData,
    //                 upcomingTrips: tripsData
    //             }
    //             callback(null, result)
    //         } catch (e) {
    //             callback(true, 'Could not get trips')
    //         }
    //     } else {
    //         callback(true, 'Could not get user')
    //     }
    // })
    const temporaryAsynWrapper = async () => {
        try {
            const userData = await promiseDb.getUser(data.id)
            const tripsData = await promiseDb.getUpcomingTrips(data.id)
            const result = {
                ...userData,
                upcomingTrips: tripsData
            }
            callback(null, result)
        } catch (e) {
            callback(true, 'Could not get trips')
        }
    }

    temporaryAsynWrapper()
}