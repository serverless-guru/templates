const { path, pathOr } = require('ramda')

// const getUsersInfo = input => {
//     const getDate = x => {
//         const m = path(['results', 0, 'profile', 'birthdayMonth'], input)
//         const d = path(['results', 0, 'profile', 'birthdayDay'], input)
//         const y = path(['results', 0, 'profile', 'birthdayYear'], input)
//         const isValid = m && d && y

//         return isValid ? `${m}-${d}-${y}` : null
//     }

//     const id         = path(['results', 0, 'id'], input)
//     const isActive   = path(['results', 0, 'isActive'], input)
//     const firstName  = path(['results', 0, 'profile', 'firstName'], input)
//     const lastName   = path(['results', 0, 'profile', 'lastName'], input)
//     const email      = path(['results', 0, 'profile', 'email'], input)
//     const ffp        = path(['results', 0, 'profile', 'username'], input)
//     const phone      = path(['results', 0, 'data', 'phone'], input)
//     const postalCode = path(['results', 0, 'data', 'address', 'zip'], input)
//     const dob        = getDate(input)

//     return { id, isActive, firstName, lastName, email, ffp, phone, postalCode, dob }
// }

const getUsersInfoOrDefault = input => {
    const getDate = x => {
        const m = pathOr(false, ['results', 0, 'profile', 'birthdayMonth'], input)
        const d = pathOr(false, ['results', 0, 'profile', 'birthdayDay'], input)
        const y = pathOr(false, ['results', 0, 'profile', 'birthdayYear'], input)
        const isValid = m && d && y

        return isValid ? `${m}-${d}-${y}` : 'N/A'
    }

    const id         = pathOr('Nothing', ['results', 0, 'id'], input)
    const isActive   = pathOr(false,     ['results', 0, 'isActive'], input)
    const firstName  = pathOr('Nothing', ['results', 0, 'profile', 'firstName'], input)
    const lastName   = pathOr('Nothing', ['results', 0, 'profile', 'lastName'], input)
    const email      = pathOr('Nothing', ['results', 0, 'profile', 'email'], input)
    const ffp        = pathOr('Nothing', ['results', 0, 'profile', 'username'], input)
    const phone      = pathOr('Nothing', ['results', 0, 'data', 'phone'], input)
    const postalCode = pathOr('Nothing', ['results', 0, 'data', 'address', 'zip'], input)
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

console.log(getUsersInfoOrDefault(userObject))