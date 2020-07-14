const subscription = require('../utils/triggerSubscription')

const getDynamoStreamList = event => {
    const dbEvent = event.Records[0].dynamodb.NewImage

    if (!dbEvent) {
        return false
    }

    return {
        PK: dbEvent.PK['S'],
        SK: dbEvent.SK['S'],
        status: dbEvent.status['S'],
        favouriteColor: dbEvent.favouriteColor['S'],
        favouriteCity: dbEvent.favouriteCity['S'],
        lastUpdated: dbEvent.lastUpdated['S'],
    }
}

module.exports.handler = async event => {
    const data = getDynamoStreamList(event)
    await subscription.triggerOnComplete(data)
    return data
}
