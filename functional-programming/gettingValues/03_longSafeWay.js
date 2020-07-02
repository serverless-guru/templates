let input = {
    results: [
        {
            profile: {
                firstName: 'John'
            }
        }
    ]
}

let id = null;
let firstName = null;
let lastName = null;
let dob = null;
let isActive = null;
let phone = null;
let postalCode = null;
let email = null;
let ffp = null;

const result = input.results && input.results[0]
if (result) {
    if (result.id) {
        uid = result.id;
    }
    if (result.isActive) {
        isActive = result.isActive;
    }

    const profile = input.results[0].profile
    if (profile) {
        if (profile.firstName) {
            firstName = profile.firstName;
        }
        if (profile.lastName) {
            lastName = profile.lastName;
        }
        if (profile.email) {
            email = profile.email;
        }
        if (profile.username) {
            ffp = profile.username;
        }
        if (profile.birthdayMonth && profile.birthdayDay && profile.birthdayYear) {
            dob = profile.birthdayMonth + '-' + profile.birthdayDay + '-' + profile.birthdayYear;
        }
    }

    const data = input.results[0].data
    if (data) {
        if (data.phones && data.phones[0] && data.phones[0].number) {
            phone = data.phones[0].number;
        }
        if (data.address && data.address.zip) {
            postalCode = data.address.zip;
        }
    }
}

console.log({ id, isActive, firstName, lastName, email, ffp, phone, postalCode, dob })
