const { callbackDb } = require('./aws')

/**
 * There are 3 callbacks involved in this file:
 * 
 * 1. callback defined in the getUser 
 * 2. callback defined in the getUpcomingTrips
 * 3. callback handed to us as the second param of our function
 *    by AWS Lambda
 * 
 */
exports.getFriendsTrips = (data, callback) => {
    callbackDb.getUser(data.id, function (err, userData) {
        if (!err) {
            callbackDb.getUpcomingTrips(data.id, function (err, tripsData) {
                if (!err) {
                    const result = {
                        ...userData,
                        upcomingTrips: tripsData
                    }
                    callback(null, result)
                } else {
                    callback(true, 'Could not get trips')
                }
            })
        } else {
            callback(true, 'Could not get user')
        }
    })
}