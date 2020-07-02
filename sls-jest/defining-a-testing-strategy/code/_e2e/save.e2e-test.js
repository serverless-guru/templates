const request = require('supertest')
const seeder = require('./utils/seeder')

describe('E2E', () => {
    beforeAll(async () => {
        await seeder.seed()
    })

    afterAll(async () => {
        await seeder.clearSeededData()
    })

    test('Can save highlighted', (done) => {   
        const url = process.env.ENDPOINT.split(' ')[4]
        request(url)
            .post('/')
            .send({
                id: 'product_1234', 
                name: 'Best Coffee Ever', 
                price: 400
            })
            .expect(200, {
                id: 'product_1234', 
                name: 'Best Coffee Ever', 
                price: 400, 
                pic: 'https://google.com',
                tweet: 'Most Recent Tweet'
            })
            .end((err, res) => {
                if (err) return done(err);
                done()
            })
    })
})