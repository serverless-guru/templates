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

if (input.results[0].id) {
    id = input.results[0].id;
}
if (input.results[0].isActive) {
    isActive = input.results[0].isActive;
}
if (input.results[0].profile.firstName) {
    firstName = input.results[0].profile.firstName;
}
if (input.results[0].profile.lastName) {
    lastName = input.results[0].profile.lastName;
}
if (input.results[0].profile.email) {
    email = input.results[0].profile.email;
}
if (input.results[0].profile.username) {
    ffp = input.results[0].profile.username;
}
if (input.results[0].profile.birthdayMonth && input.results[0].profile.birthdayDay && input.results[0].profile.birthdayYear) {
    dob = input.results[0].profile.birthdayMonth + '-' + input.results[0].profile.birthdayDay + '-' + input.results[0].profile.birthdayYear;
}
if (input.results[0].data.phones) {
    phone = input.results[0].data.phones[0].number;
}
if (input.results[0].data.address.zip) {
    postalCode = input.results[0].data.address.zip;
}

console.log({ id, isActive, firstName, lastName, email, ffp, phone, postalCode, dob })
