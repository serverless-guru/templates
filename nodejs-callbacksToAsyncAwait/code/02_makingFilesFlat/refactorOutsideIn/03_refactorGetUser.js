const { callbackDb, promiseDb } = require('../aws')

// module.exports = async (data) => {
//     return new Promise((resolve, reject) => {
//         callbackDb.getUser(data.id, function (err, userData) {
//             if (!err) {
//                 callbackDb.getUpcomingTrips(data.id, function (err, tripsData) {
//                     if (!err) {
//                         const result = {
//                             ...userData,
//                             upcomingTrips: tripsData
//                         }
//                         resolve(result)
//                     } else {
//                         reject('Could not get trips')
//                     }
//                 })
//             } else {
//                 reject('Could not get user')
//             }
//         })
//     })
// }

module.exports = async (data) => {
    try {
        const userData = await promiseDb.getUser(data.id)
        return new Promise((resolve, reject) => {
            callbackDb.getUpcomingTrips(data.id, function (err, tripsData) {
                if (!err) {
                    const result = {
                        ...userData,
                        upcomingTrips: tripsData
                    }
                    resolve(result)
                } else {
                    reject('Could not get trips')
                }
            })
        })
    } catch (e) {
        return e
    }
}