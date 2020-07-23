const db = require('./db')
const mysql = require('mysql')

const makeConnection = () => {
    const connection = mysql.createConnection({
        host: process.env.AURORA_HOST,
        user: process.env.AURORA_USERNAME,
        password: process.env.AURORA_PASSWORD,
        database: process.env.AURORA_DB_NAME,
        port: process.env.AURORA_PORT
    });

    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack)
            return
        }

        console.log('connected as id ' + connection.threadId)
    })

    return connection
}

exports.create = async (event) => {
    const input = JSON.parse(event.body)
    const connection = makeConnection()
    const insertedResult = await db.insert(connection, input)
    connection.end()
    return {
        statusCode: 200,
        body: JSON.stringify(insertedResult)
    }
}

exports.get = async (event) => {
    const input = JSON.parse(event.body)
    const connection = makeConnection()
    const selectedResult = await db.selectOneUser(connection, input.id)
    connection.end()
    return {
        statusCode: 200,
        body: JSON.stringify(selectedResult)
    }
}

exports.remove = async (event) => {
    const input = JSON.parse(event.body)
    const connection = makeConnection()
    const selectedResult = await db.deleteUser(connection, input.id)
    connection.end()
    return {
        statusCode: 200,
        body: JSON.stringify(selectedResult)
    }
}

exports.seed = async (event) => {
    const input = JSON.parse(event.body)
    const connection = makeConnection()
    const selectedResult = await db.seed(connection)
    connection.end()
    return {
        statusCode: 200,
        body: JSON.stringify(selectedResult)
    }
}