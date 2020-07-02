const request = require('supertest')

describe('E2E', () => {
    test('TEST 1', (done) => {   
        const url = process.env.ENDPOINT.split(' ')[4]

        request(url)
            .post('/')
            .send({id: '1235', name: 'john'})
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done()
            })
    })
})