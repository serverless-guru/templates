const db = require('../utils/db')

const io = {
    snsInput: e => {
        const snsMessage = e.Records[0].Sns
        return JSON.parse(snsMessage.Message)
    }
}

const mockExternalCall = time => new Promise(res => {
    setTimeout(() => {
        res()
    }, time)
})


module.exports.handler = async event => {
    const data = io.snsInput(event)
    try {
        // ...external service 1
        await mockExternalCall(2000)

        const diceRoll = Math.floor(Math.random() * 6) + 1
        if (diceRoll < 3) {
            throw new Error('somethign went wrong')
        }

        // ...external service 2
        await mockExternalCall(10000)

        // ...external service 3
        await mockExternalCall(2000)

        await db.set({
            ...data,
            status: 'COMPLETE',
            lastUpdated: Date.now().toString()
        })
    } catch (e) {
        await db.set({
            ...data,
            status: 'ERROR',
            lastUpdated: Date.now().toString()
        })
    }
}


