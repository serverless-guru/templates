const db = require('../utils/db')
const emit = require('../utils/emit')

const getProfile = async event => {
    const res = await db.get({
        PK: 'user_1234',
        SK: 'profile'
    })

    return res.Item
}

const createProfile = async data => {

    const profile = {
        ...data,
        SK: 'profile',
        status: 'PROCESSING',
        favouriteColor: 'blue',
        favouriteCity: 'Calgary',
        lastUpdated: Date.now().toString()
    }

    await db.set(profile)
    await emit.processStarted(profile)
    return profile
}

const route = e => (t, f) =>
    e.info.parentTypeName === t &&
    e.info.fieldName === f

module.exports.handler = async event => {
    const is = route(event)

    if (is('Query', 'getProfile')) {
        return await getProfile(event)
    }

    if (is('Mutation', 'createProfile')) {
        return await createProfile(event.arguments.input)
    }
}


