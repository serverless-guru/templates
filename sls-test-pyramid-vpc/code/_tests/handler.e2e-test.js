const request = require('supertest')

describe('E2E', () => {
    test('User can create a user', (done) => {  
        const createUrl = process.env.CREATE_ENDPOINT.split(' ')[4]
        request(createUrl)
            .post('/')
            .send({
                id: '1235', 
                name: 'john'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done()
            })
    })

    test('User can get a user', (done) => {   
        const getUrl = process.env.GET_ENDPOINT.split(' ')[4]
        request(getUrl)
            .post('/')
            .send({id: '1235'})
            .expect(200, {
                id: 1235,
                name: 'john'
            })
            .end((err, res) => {
                if (err) return done(err);
                done()
            })
    })

    test('User can remove a user', (done) => {   
        const removeUrl = process.env.REMOVE_ENDPOINT.split(' ')[4]
        request(removeUrl)
            .post('/')
            .send({id: '1235'})
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done()
            })
    })
})