const { promiseDb } = require('../aws')

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