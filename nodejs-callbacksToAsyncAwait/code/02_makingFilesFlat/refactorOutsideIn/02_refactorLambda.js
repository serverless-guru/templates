const { callbackDb } = require('../aws')


// module.exports = (data, callback) => {
//     callbackDb.getUser(data.id, function (err, userData) {
//         if (!err) {
//             callbackDb.getUpcomingTrips(data.id, function (err, tripsData) {
//                 if (!err) {
//                     const result = {
//                         ...userData,
//                         upcomingTrips: tripsData
//                     }
//                     callback(null, result)
//                 } else {
//                     callback(true, 'Could not get trips')
//                 }
//             })
//         } else {
//             callback(true, 'Could not get user')
//         }
//     })
// }

module.exports = async (data) => {
    return new Promise((resolve, reject) => {
        callbackDb.getUser(data.id, function (err, userData) {
            if (!err) {
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
            } else {
                reject('Could not get user')
            }
        })
    })
}