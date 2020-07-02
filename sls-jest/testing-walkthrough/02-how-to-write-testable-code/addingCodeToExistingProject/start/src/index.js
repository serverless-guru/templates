const userSession = require('./userSession');
const tripDb = require('./tripDb');

const handler = async (user) => {
    let tripList = [];
    let loggedUser = userSession.getLoggedUser();
    let isFriend = false;
    if (loggedUser != null) {
        let friends = user.getFriends();
        for (let i=0; i < friends.length; i++) {
            let friend = friends[i];
            if (friend == loggedUser) {
                isFriend = true;
                break;
            }
        };
        if (isFriend) {
            tripList = tripDb.findTripsByUser(user)
        }   

        return tripList
    } else {
        throw new Error('User not logged in.')
    }
}

exports.handler = handler