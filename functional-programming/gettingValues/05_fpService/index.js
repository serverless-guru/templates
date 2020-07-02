const U = require('./utils')

const getUsersInfo = input => {
    const getDate = x => {
        const m = U.path(['results', 0, 'profile', 'birthdayMonth'], input)
        const d = U.path(['results', 0, 'profile', 'birthdayDay'], input)
        const y = U.path(['results', 0, 'profile', 'birthdayYear'], input)
        const isValid = m && d && y

        return isValid ? `${m}-${d}-${y}` : null
    }

    const id         = U.path(['results', 0, 'id'], input)
    const isActive   = U.path(['results', 0, 'isActive'], input)
    const firstName  = U.path(['results', 0, 'profile', 'firstName'], input)
    const lastName   = U.path(['results', 0, 'profile', 'lastName'], input)
    const email      = U.path(['results', 0, 'profile', 'email'], input)
    const ffp        = U.path(['results', 0, 'profile', 'username'], input)
    const phone      = U.path(['results', 0, 'data', 'phone'], input)
    const postalCode = U.path(['results', 0, 'data', 'address', 'zip'], input)
    const dob        = getDate(input)

    return { id, isActive, firstName, lastName, email, ffp, phone, postalCode, dob }
}

let userObject = {
    results: [
        {
            profile: {
                firstName: 'John'
            }
        }
    ]
}

console.log(getUsersInfo(userObject))