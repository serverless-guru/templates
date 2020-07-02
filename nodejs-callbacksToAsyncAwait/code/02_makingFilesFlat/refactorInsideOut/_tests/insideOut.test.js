const startingPoint = require('../01_start')
const step1 = require('../02_refactorUpcomingTrips')
const step2 = require('../03_refactorGetUser')
const step3 = require('../04_refactorLambda')
describe('insideOut Refactor', () => {
    test('works at initial startingPoint', (done) => {
        startingPoint({ id: 1 }, (err, x) => {
            expect(x).toEqual({
                "id": 1,
                "name": "John Smith",
                "tripsTaken": 20,
                "upcomingTrips": [
                    "trip1",
                    "trip2",
                    "trip3",
                ],
            })
            done()
        })
    })

    test('works at step 1', (done) => {
        step1({ id: 1 }, (err, x) => {
            expect(x).toEqual({
                "id": 1,
                "name": "John Smith",
                "tripsTaken": 20,
                "upcomingTrips": [
                    "trip1",
                    "trip2",
                    "trip3",
                ],
            })
            done()
        })
    })

    test('works at step 2', (done) => {
        step2({ id: 1 }, (err, x) => {
            expect(x).toEqual({
                "id": 1,
                "name": "John Smith",
                "tripsTaken": 20,
                "upcomingTrips": [
                    "trip1",
                    "trip2",
                    "trip3",
                ],
            })
            done()
        })
    })

    test('works at step 3', async () => {
        const result = await step3({ id: 1 })
        expect(result).toEqual({
            "id": 1,
            "name": "John Smith",
            "tripsTaken": 20,
            "upcomingTrips": [
                "trip1",
                "trip2",
                "trip3",
            ],
        })
    })
})
