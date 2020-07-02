const { callbackDb, promiseDb } = require('../aws')

// module.exports = async (data) => {
//     try {
//         const userData = await promiseDb.getUser(data.id)
//         return new Promise((resolve, reject) => {
//             callbackDb.getUpcomingTrips(data.id, function (err, tripsData) {
//                 if (!err) {
//                     const result = {
//                         ...userData,
//                         upcomingTrips: tripsData
//                     }
//                     resolve(result)
//                 } else {
//                     reject('Could not get trips')
//                 }
//             })
//         })
//     } catch (e) {
//         return e
//     }
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