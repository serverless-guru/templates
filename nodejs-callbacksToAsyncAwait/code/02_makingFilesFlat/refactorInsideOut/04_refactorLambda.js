const { callbackDb, promiseDb } = require('../aws')

// module.exports = (data, callback) => {
//     const temporaryAsynWrapper = async () => {
//         try {
//             const userData = await promiseDb.getUser(data.id)
//             const tripsData = await promiseDb.getUpcomingTrips(data.id)
//             const result = {
//                 ...userData,
//                 upcomingTrips: tripsData
//             }
//             callback(null, result)
//         } catch (e) {
//             callback(true, 'Could not get trips')
//         }
//     }

//     temporaryAsynWrapper()
// }

module.exports = async (data) => {
    try {
        const userData = await promiseDb.getUser(data.id)
        const tripsData = await promiseDb.getUpcomingTrips(data.id)
        return {
            ...userData,
            upcomingTrips: tripsData
        }
    } catch (e) {
        return e
    }
}