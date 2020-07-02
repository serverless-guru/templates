const makeFutureDate = days => {
    let date = new Date();
    date.setDate(date.getDate() + days)
    return date
}

module.exports = {
    findTripsByUser: (user) => [
        {
            id: '1234',
            user: user,
            location: 'Portland',
            startDate: makeFutureDate(5)
        },
        {
            id: '1235',
            user: user,
            location: 'Seattle',
            startDate: makeFutureDate(7)
        }
    ]
}