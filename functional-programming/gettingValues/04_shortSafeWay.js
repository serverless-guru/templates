let input = {
    results: [
        {
            profile: {
                firstName: 'John'
            }
        }
    ]
}

const get = (o, p) =>
    p.reduce((xs, x) =>
        (xs && xs[x]) ? xs[x] : null, o)

const getDate = x => {
    const m = get(input, ['results', 0, 'profile', 'birthdayMonth'])
    const d = get(input, ['results', 0, 'profile', 'birthdayDay'])
    const y = get(input, ['results', 0, 'profile', 'birthdayYear'])
    const isValid = m && d && y

    return isValid ? `${m}-${d}-${y}` : null
}

const id         = get(input, ['results', 0, 'id'])
const isActive   = get(input, ['results', 0, 'isActive'])
const firstName  = get(input, ['results', 0, 'profile', 'firstName'])
const lastName   = get(input, ['results', 0, 'profile', 'middleName'])
const email      = get(input, ['results', 0, 'profile', 'email'])
const ffp        = get(input, ['results', 0, 'profile', 'username'])
const phone      = get(input, ['results', 0, 'data', 'phone'])
const postalCode = get(input, ['results', 0, 'data', 'address', 'zip'])
const dob        = getDate(input)

console.log({ id, isActive, firstName, lastName, email, ffp, phone, postalCode, dob })
