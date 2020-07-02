require('dotenv').config()
const request = require('supertest')
const apiKey = process.env.API_KEY

let url = ''
describe('Products Endpoint', () => {
    beforeAll(async () => {
        url = process.env.ENDPOINT.split(' ')[4]
    })

    test('can get products', async (done) => {
        request(url)
            .post('/')
            .send({ id: '1235', name: 'john' })
            .set('x-api-key', apiKey)
            .expect(200, {
                id: '1234',
                name: 'Dark Coffee'
            })
            .end((err, res) => {

                if (err) return done(err);
                done()
            })
    })

    test('will return 403 if api key is not included', async (done) => {
        request(url)
            .post('/')
            .send({ id: '1235', name: 'john' })
            .expect(403, {
                message: 'Forbidden',
            })
            .end((err, res) => {
                if (err) return done(err);
                done()
            })
    })
})