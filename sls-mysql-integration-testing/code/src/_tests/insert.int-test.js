require('dotenv').config()
const action = require('../db')
const mysql = require('mysql')

const makeConnection = () => {
    const connectionParams = {
        host: process.env.TEST_HOST,
        user: process.env.TEST_USER,
        password: process.env.TEST_PASSWORD,
        database: process.env.TEST_DATABASE,
        port: process.env.TEST_PORT
    }

    const connection = mysql.createConnection(connectionParams)

    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack)
            return
        }

        console.log('connected as id ' + connection.threadId)
    })

    return connection
}



describe('insert', () => {
 
    test('will insert', async (done) => {
       
        // MAKE CONNECTION
        const connection = makeConnection()
    
        // TEST FUNCTION
        const mockInput = {
            id: '7',
            name: 'John'
        }
  
        const insertedResult = await action.insert(connection, mockInput)        
        expect(insertedResult).toBe(mockInput)

        const selectedResult = await action.selectOneUser(connection, '7')
        console.log(selectedResult)

        // CLEANUP
        await action.deleteUser(connection, 7)
        connection.end()
        
        // DONE
        done()
    })


    test('will properly error if id is not defined', async (done) => {
       
        // MAKE CONNECTION
        const connection = makeConnection()
    
        // TEST FUNCTION
        const mockInput = {
            id: undefined,
            name: 'John'
        }

        try {
           await action.insert(connection, mockInput)        
        } catch(e) {
            expect(e.message).toBe(`ER_BAD_NULL_ERROR: Column 'id' cannot be null`)
        }

        // CLEANUP
        connection.end()
        
        // DONE
        done() 
    })
})